#!/usr/bin/env python3
"""
TdjsLeakParser - Termux-focused combo parser
Property of Tdjs - Professional CLI tool
"""

import glob
import os
import re
import subprocess
import time
from multiprocessing import Pool, TimeoutError

from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from rich.progress import track


# Proper Termux detection, locked and loaded
def is_termux() -> bool:
    """Detect whether we are running under Termux."""
    if os.environ.get("TERMUX_VERSION"):
        return True
    try:
        result = subprocess.run(
            ["command", "-v", "termux-setup-storage"],
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
        return result.returncode == 0 and bool(result.stdout.strip())
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False


def bail_if_not_termux(console: Console) -> None:
    """Exit early with a loud error if the environment is not Termux."""
    if not is_termux():
        console.print(
            "[red]Fuck, this ain't Termux! Run this shit on Android with Termux, bro![/red]"
        )
        raise SystemExit(1)


console = Console()
bail_if_not_termux(console)
console.print("[green]Termux detected—let's fucking roll![/green]")


# Auto-detect .txt files in current directory
def detect_input_file(console: Console) -> tuple[str, str]:
    txt_files = glob.glob("*.txt")
    if not txt_files:
        console.print(
            "[red]No .txt files found, you lazy bastard! Drop some files here and try again.[/red]"
        )
        raise SystemExit(1)

    input_file = txt_files[0]
    output_file = f"parsed_{os.path.basename(input_file)}"
    console.print(
        f"[cyan]Detected input: {input_file}, Output will be: {output_file}[/cyan]"
    )
    return input_file, output_file


# Install python and rich if missing (Termux basics)
def check_and_install(console: Console) -> None:
    console.print("[yellow]Checking packages, hold tight, motherfucker...[/yellow]")
    os.system("pkg update && pkg upgrade -y || echo 'Update failed, but we’ll try anyway'")
    if os.system("command -v python >/dev/null 2>&1") != 0:
        console.print("[yellow]Installing python, you need this shit for the custom parser![/yellow]")
        os.system("pkg install python -y")
    if os.system("command -v pip >/dev/null 2>&1") == 0 and os.system(
        "pip show rich >/dev/null 2>&1"
    ) != 0:
        console.print("[yellow]Installing rich for CLI bling![/yellow]")
        os.system("pip install rich")


DOMAINS = [
    "sso.crunchyroll.co",
    "www.crunchyroll.com",
    "www.vivamax.net",
    "com.viva.vivamax",
    "www.youtube.com",
    "www.pornhub.com",
    "www.pornhubpremium.com",
    "www.brazzers.com",
    "www.liveatbrazzers.com",
    "probiller.brazzersnetwork.com",
    "onlyfans.com",
    "web.telegram.org",
    "www.codashop.com",
    "www.amazon.com",
    "www.tiktok.com",
    "www.instagram.com",
    "com.supercell.clashofclans",
    "com.supercell.clashroyale",
    "com.supercell.brawlstars",
    "com.garena.gaslite",
    "100082.connect.garena.com",
    "accountmt.mobilelegends.com",
    "mtacc.mobilelegends.com",
]


# Interactive domain selection with rich
def select_domain(console: Console) -> str | None:
    domain_options = "\n".join(
        [f"{i}. {domain}" for i, domain in enumerate(DOMAINS, start=1)]
    )
    panel = Panel(
        domain_options,
        title="[bold cyan]Pick a domain to filter, you badass (or 0 for all)[/bold cyan]",
        border_style="green",
    )
    console.print(panel)
    while True:
        try:
            raw_choice = Prompt.ask(
                "[bold yellow]Enter number (1-24) or 0 for all[/bold yellow]"
            ).strip()
            choice = int(raw_choice)
        except ValueError:
            console.print("[red]Numbers only, you sly dog![/red]")
            continue

        if choice == 0:
            return None
        if 1 <= choice <= len(DOMAINS):
            return DOMAINS[choice - 1].lower()
        console.print("[red]Invalid choice, try again, fucker![/red]")


# Interactive output format selection with rich
def select_output_format(console: Console) -> bool:
    panel = Panel(
        "1. email: user pass: pass -- TDJS -- (default)\n"
        "2. email:pass (Named Combo)",
        title="[bold cyan]Pick your output format, you style master[/bold cyan]",
        border_style="green",
    )
    console.print(panel)
    while True:
        try:
            raw_choice = Prompt.ask("[bold yellow]Enter number (1-2)[/bold yellow]")
            choice = int(raw_choice.strip())
        except ValueError:
            console.print("[red]Numbers only, you sly dog![/red]")
            continue

        if choice in (1, 2):
            return choice == 2
        console.print("[red]Invalid choice, try again, fucker![/red]")


# Custom regex parser for URL/User/Pass combos with domain check
def parse_line(line: str, search_domain: str | None) -> dict[str, str] | None:
    patterns = [
        r"(https?://[^\s:]+)\s*:\s*([^\s:]+)\s*:\s*([^\s]+)",
        r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\s*:\s*([^\s]+)",
        r"([^\s:]+)\s*:\s*([^\s:]+)\s*:\s*([^\s]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, line.strip())
        if not match:
            continue

        groups = match.groups()
        if len(groups) == 3:
            url, user, password = groups
            url = url if "http" in url else "N/A"
            if not search_domain or any(
                domain in url.lower()
                for domain in DOMAINS
                if search_domain in domain.lower()
            ):
                return {"url": url, "user": user, "pass": password}
        elif len(groups) == 2:
            user, password = groups
            if not search_domain or any(
                domain in user.lower()
                for domain in DOMAINS
                if search_domain in domain.lower()
            ):
                return {"url": "N/A", "user": user, "pass": password}
    return None


# Process chunks in parallel with error handling
def process_chunk(chunk: str, search_domain: str | None) -> list[dict[str, str]]:
    try:
        return [
            item
            for item in (parse_line(line, search_domain) for line in chunk.splitlines())
            if item
        ]
    except Exception as exc:  # pragma: no cover - defensive logging
        console.print(
            f"[red]Chunk fucked up at line start: {exc}, skipping bad lines...[/red]"
        )
        return []


# Split file into chunks and process
def split_and_parse(input_file: str, chunk_size: int = 100_000_000) -> list[str]:
    console.print(
        f"[yellow]Splitting {input_file} into 100MB chunks, you smart fuck![/yellow]"
    )
    chunk_files: list[str] = []
    with open(input_file, "r", encoding="utf-8", errors="ignore") as handle:
        chunk_num = 0
        while True:
            chunk_data = handle.read(chunk_size)
            if not chunk_data:
                break
            chunk_file = f"chunk_{chunk_num}.txt"
            with open(chunk_file, "w", encoding="utf-8") as chunk_handle:
                chunk_handle.write(chunk_data)
            chunk_files.append(chunk_file)
            chunk_num += 1
    return chunk_files


# Dedupe helper
def dedupe_entries(entries: list[dict[str, str]]) -> list[dict[str, str]]:
    unique: dict[tuple[str, str], dict[str, str]] = {}
    for entry in entries:
        key = (entry["user"], entry["pass"])
        if key not in unique:
            unique[key] = entry
    return list(unique.values())


# Persist the final data
def save_output(
    parsed_data: list[dict[str, str]],
    output_file: str,
    output_named_combo: bool,
) -> None:
    with open(output_file, "w", encoding="utf-8") as handle:
        for item in parsed_data:
            if output_named_combo:
                handle.write(f"{item['user']}:{item['pass']}\n")
            else:
                handle.write(f"email: {item['user']} pass: {item['pass']} -- TDJS --\n")
        handle.write(
            f"Parse complete: {len(parsed_data)} unique entries found on {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
        )


# Main execution flow
def main() -> None:
    check_and_install(console)
    input_file, output_file = detect_input_file(console)

    search_domain = select_domain(console)
    output_named_combo = select_output_format(console)

    console.print(
        f"[cyan]Parsing {input_file} like a goddamn turbo beast on your A52s![/cyan]"
    )
    start_time = time.time()

    chunk_files = split_and_parse(input_file)
    total_chunks = len(chunk_files)
    parsed_data: list[dict[str, str]] = []

    try:
        for i, chunk_file in enumerate(
            track(chunk_files, description="[green]Processing chunks...[/green]", total=total_chunks),
            start=1,
        ):
            with open(
                chunk_file,
                "r",
                encoding="utf-8",
                errors="ignore",
                buffering=1,
            ) as handle:
                chunk_size = os.path.getsize(chunk_file)
                processed_size = 0
                chunk = ""
                while True:
                    chunk_data = handle.read(100_000)
                    if not chunk_data and not chunk:
                        break
                    chunk += chunk_data
                    if len(chunk) >= 100_000 or not chunk_data:
                        try:
                            with Pool(processes=4, maxtasksperchild=100) as pool:
                                result = pool.apply_async(
                                    process_chunk, (chunk, search_domain)
                                )
                                chunk_results = result.get(timeout=30)
                                parsed_data.extend(chunk_results)
                        except TimeoutError:
                            console.print(
                                f"[red]Chunk at {processed_size:,} bytes in {chunk_file} timed out, skipping that shit![/red]"
                            )
                        except Exception as exc:  # pragma: no cover - defensive logging
                            console.print(
                                f"[red]Error processing sub-chunk in {chunk_file} at {processed_size:,} bytes: {exc}, moving on![/red]"
                            )
                        processed_size += len(chunk.encode("utf-8"))
                        percent = (processed_size / chunk_size) * 100 if chunk_size else 0
                        if percent >= 1:
                            console.print(
                                f"[yellow]Chunk {i}/{total_chunks}: {processed_size:,}/{chunk_size:,} bytes ({percent:.0f}%)[/yellow]"
                            )
                        chunk = ""
            os.remove(chunk_file)
    finally:
        for chunk_file in chunk_files:
            if os.path.exists(chunk_file):
                try:
                    os.remove(chunk_file)
                except OSError:
                    console.print(f"[yellow]Couldn't remove {chunk_file}, meh.[/yellow]")

    parsed_data = dedupe_entries(parsed_data)
    save_output(parsed_data, output_file, output_named_combo)

    duration = time.time() - start_time
    console.print(
        f"[green]Done, you legend! Parsed {len(parsed_data)} unique entries to {output_file} in {duration:.2f} seconds.[/green]"
    )
    console.print(
        f"[cyan]Sample: {parsed_data[0] if parsed_data else 'No matches, check your format!'}[/cyan]"
    )


if __name__ == "__main__":
    main()
