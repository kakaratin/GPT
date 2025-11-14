#!/usr/bin/env python3
"""Utility CLI for managing rotating request tokens.

The script keeps a token on disk, optionally falls back to a value supplied via
an environment variable, and offers convenience helpers for updating, masking,
and validating the token against an HTTP endpoint.  It has no external branding
or artwork so it can be embedded into other tooling without cosmetic changes.
"""
from __future__ import annotations

import argparse
import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import requests


TOKEN_FILE = Path("token.json")
FALLBACK_ENV = "ROTATING_TOKEN"
DEFAULT_HEADER_NAME = "x-rotating-token"


class TokenStoreError(RuntimeError):
    """Raised when token persistence encounters an unrecoverable error."""


@dataclass
class TokenStore:
    """Persist a token on disk with a configurable fallback."""

    path: Path = TOKEN_FILE
    fallback: Optional[str] = None

    def __post_init__(self) -> None:
        if self.fallback is None:
            self.fallback = os.environ.get(FALLBACK_ENV)

    def read(self) -> Optional[str]:
        """Return the stored token or the fallback if no file exists."""
        if self.path.exists():
            try:
                data = json.loads(self.path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:  # pragma: no cover - defensive
                raise TokenStoreError(f"Malformed token file: {exc}") from exc
            token = data.get("token")
            if token:
                return str(token)
        return self.fallback

    def write(self, token: str) -> None:
        """Persist the supplied token as JSON."""
        self.path.write_text(json.dumps({"token": token}, indent=2), encoding="utf-8")

    def clear(self) -> None:
        """Remove the on-disk token if present."""
        try:
            self.path.unlink()
        except FileNotFoundError:
            pass

    def masked(self) -> str:
        """Return a user-friendly masked representation of the token."""
        token = self.read()
        if not token:
            return "<empty>"
        if len(token) <= 8:
            return "*" * len(token)
        return f"{token[:4]}…{token[-4:]}"


def build_session(proxy: Optional[str]) -> requests.Session:
    """Create a requests session with an optional proxy."""
    session = requests.Session()
    if proxy:
        session.proxies = {
            "http": proxy,
            "https": proxy,
        }
    return session


def validate_token(url: str, token: str, header_name: str, proxy: Optional[str]) -> int:
    """Send a HEAD request to validate that the token is accepted."""
    session = build_session(proxy)
    response = session.head(url, headers={header_name: token}, timeout=10)
    return response.status_code


def command_show(store: TokenStore, _: argparse.Namespace) -> int:
    print(store.masked())
    return 0


def command_set(store: TokenStore, args: argparse.Namespace) -> int:
    store.write(args.token)
    print("Token updated.")
    return 0


def command_clear(store: TokenStore, _: argparse.Namespace) -> int:
    store.clear()
    print("Stored token removed.")
    return 0


def command_validate(store: TokenStore, args: argparse.Namespace) -> int:
    token = store.read()
    if not token:
        print("No token available. Set one first with the 'set' command.")
        return 1
    status = validate_token(args.url, token, args.header, args.proxy)
    print(f"Validation response status: {status}")
    return 0 if 200 <= status < 400 else 1


def create_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.set_defaults(command=None)

    subparsers = parser.add_subparsers(dest="command")

    show_parser = subparsers.add_parser("show", help="Display the stored token in masked form")
    show_parser.set_defaults(func=command_show)

    set_parser = subparsers.add_parser("set", help="Persist a new token value")
    set_parser.add_argument("token", help="The token value to store")
    set_parser.set_defaults(func=command_set)

    clear_parser = subparsers.add_parser("clear", help="Remove the stored token")
    clear_parser.set_defaults(func=command_clear)

    validate_parser = subparsers.add_parser("validate", help="Validate the token against an endpoint")
    validate_parser.add_argument("url", help="Endpoint that expects the token")
    validate_parser.add_argument(
        "--header",
        default=DEFAULT_HEADER_NAME,
        help=f"Header name to supply the token (default: {DEFAULT_HEADER_NAME})",
    )
    validate_parser.add_argument(
        "--proxy",
        help="Optional HTTP/HTTPS proxy to use during validation",
    )
    validate_parser.set_defaults(func=command_validate)

    return parser


def main(argv: Optional[list[str]] = None) -> int:
    parser = create_parser()
    args = parser.parse_args(argv)
    if not args.command:
        parser.print_help()
        return 1

    store = TokenStore()
    return args.func(store, args)


if __name__ == "__main__":
    raise SystemExit(main())
