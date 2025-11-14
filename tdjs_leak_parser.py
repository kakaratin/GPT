#!/usr/bin/env python3
"""
TdjsLeakParser - Extract domain-specific lines from log files
Property of Tdjs - Professional CLI tool
"""

import os
import sys

from rich.console import Console, Group
from rich.panel import Panel
from rich.table import Table
from rich.progress import (
    Progress,
    SpinnerColumn,
    TextColumn,
    BarColumn,
    TaskProgressColumn,
)
from rich.prompt import IntPrompt
from rich.text import Text
from rich import box
from rich.align import Align

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

PREVIEW_LINES = 10

# Initialize rich console
console = Console()


def print_banner():
    """Print an INSANE professional CLI banner"""
    accent = "#ff53d6"
    neon = "#00f7ff"
    glow = "#f8ff9a"
    pulse = "#a975ff"
    backdrop = "#15001f"

    logo_blocks = [
        (
            accent,
            [
                "          _   _ _______ _____",
                "    /\\   | \\ | |__   __|_   _|",
                "   /  \\  |  \\| |  | |    | |",
                "  / /\\ \\ | . ` |  | |    | |",
                " / ____ \\| |\\  |  | |   _| |_",
                "/_/    \\_\\_| \\_|  |_|  |_____|",
            ],
        ),
        (
            neon,
            [
                "  _____      __     __",
                " / ____|   /\\ \\   / /",
                "| |  __   /  \\ \\_/ /",
                "| | |_ | / /\\ \\   /",
                "| |__| |/ ____ \\| |",
                " \\_____/_/    \\_\\_|",
            ],
        ),
        (
            glow,
            [
                " _____  ________      __",
                "|  __ \\|  ____\\ \\    / /",
                "| |  | | |__   \\ \\  / /",
                "| |  | |  __|   \\ \\/ /",
                "| |__| | |____   \\  /",
                "|_____/|______|   \\_/",
            ],
        ),
    ]

    logo_renderables: list[Text] = []
    for color, block in logo_blocks:
        for line in block:
            logo_renderables.append(
                Text(line, style=f"bold {color}", justify="center")
            )
        logo_renderables.append(Text("", justify="center"))

    badge = Text(
        "✦ ANTI GAY DEV ✦",
        style=f"bold {pulse} on #2b0040",
        justify="center",
    )

    tagline = Text(
        "PROPERTY OF TDJS // GLITCH OPS DIRECTIVE",
        style=f"bold {neon}",
        justify="center",
    )

    sub_tagline = Text(
        "Relentless log scrapes. Zero apologies.",
        style=f"italic {glow}",
        justify="center",
    )

    feature_grid = Table.grid(padding=(0, 3))
    feature_grid.add_column(justify="right", style=f"{neon}")
    feature_grid.add_column(justify="left", style="white")
    feature_grid.add_row("⚡", "Anti-filter recon with neon swagger")
    feature_grid.add_row("♞", "Tdjs-branded exports—every capture stamped")
    feature_grid.add_row("☣", "Cinematic preview buffering your intel drip")

    banner_body = Group(
        *logo_renderables,
        badge,
        Text("═" * 70, style=f"{accent}", justify="center"),
        tagline,
        sub_tagline,
        Text("═" * 70, style=f"{accent}", justify="center"),
        Align.center(feature_grid),
    )

    panel = Panel(
        banner_body,
        box=box.DOUBLE,
        border_style=f"bold {neon}",
        padding=(1, 5),
        subtitle="[bold #ff9bff]Leak Parser v2.6[/bold #ff9bff]",
        subtitle_align="right",
        style=f"on {backdrop}",
        title="[bold #ff53d6]ANTI GAY DEV[/bold #ff53d6]",
        title_align="left",
    )

    console.print("\n")
    console.print(Align.center(panel))
    console.print()


def select_domain() -> str:
    """Select a domain from the predefined list using Rich table"""
    console.print("\n")
    console.rule("[bold cyan]🎯 SELECT DOMAIN[/bold cyan]", style="cyan")

    # Create a table for domains
    table = Table(show_header=False, box=box.SIMPLE, padding=(0, 2))
    table.add_column("No.", style="yellow", width=4)
    table.add_column("Domain", style="cyan")

    for i, domain in enumerate(DOMAINS, 1):
        table.add_row(f"{i}.", domain)

    console.print(table)

    while True:
        try:
            choice = IntPrompt.ask(
                "\n[bold yellow]➤ Enter domain number[/bold yellow]", console=console
            )
            if 1 <= choice <= len(DOMAINS):
                selected = DOMAINS[choice - 1].lower()
                console.print(f"[green]✓[/green] Selected: [bold]{selected}[/bold]")
                return selected
            else:
                console.print("[red]✗ Invalid number. Try again.[/red]")
        except (ValueError, KeyboardInterrupt):
            console.print("\n[red]Cancelled by user.[/red]")
            sys.exit(0)


def select_filter_option() -> bool:
    """Ask user if they want to include domain in output lines"""
    console.print("\n")
    console.rule("[bold cyan]⚙️  OUTPUT OPTIONS[/bold cyan]", style="cyan")

    console.print("\n[white]Include domain in output?[/white]")
    console.print("  [green]1.[/green] Yes - Keep full lines (includes domain)")
    console.print(
        "  [yellow]2.[/yellow] No  - Remove domain from lines (cleaner output)"
    )

    while True:
        try:
            choice = IntPrompt.ask(
                "\n[bold yellow]➤ Enter choice (1 or 2)[/bold yellow]", console=console
            )
            if choice == 1:
                console.print("[green]✓[/green] Will keep domain in output")
                return True
            elif choice == 2:
                console.print("[green]✓[/green] Will remove domain from output")
                return False
            else:
                console.print("[red]✗ Enter 1 or 2[/red]")
        except (ValueError, KeyboardInterrupt):
            console.print("\n[red]Cancelled by user.[/red]")
            sys.exit(0)


def detect_and_select_log_file() -> str:
    """Detect and select a log file from current directory using Rich"""
    current_dir = os.getcwd()
    console.print("\n")
    console.rule("[cyan]SELECT INPUT FILE[/cyan]", style="cyan")
    console.print(f"\n[blue]ℹ[/blue]  Scanning: [white]{current_dir}[/white]")

    # Get all txt files except output files
    txt_files = [
        f
        for f in os.listdir(current_dir)
        if f.lower().endswith(".txt") and not f.startswith("Extracted_")
    ]

    if not txt_files:
        console.print("[red]✗ No TXT files found in this directory.[/red]")
        console.print("[yellow]⚠[/yellow]  Change to the correct folder and try again.")
        sys.exit(1)

    txt_files.sort()

    if len(txt_files) == 1:
        selected = txt_files[0]
        console.print(f"[green]✓[/green] Only one TXT found: [white]{selected}[/white]")
        console.print("[blue]ℹ[/blue]  Auto-selecting...")
        return os.path.join(current_dir, selected)

    # Create table for file selection
    table = Table(show_header=True, box=box.SIMPLE, padding=(0, 2))
    table.add_column("No.", style="yellow", width=4)
    table.add_column("File", style="cyan")
    table.add_column("Size", style="white", justify="right")

    for i, file in enumerate(txt_files, 1):
        file_size = os.path.getsize(os.path.join(current_dir, file))
        size_mb = file_size / (1024 * 1024)
        table.add_row(f"{i}.", file, f"{size_mb:.2f} MB")

    console.print(table)

    while True:
        try:
            choice = IntPrompt.ask(
                "\n[yellow]Enter file number[/yellow]", console=console
            )
            if 1 <= choice <= len(txt_files):
                selected_file = os.path.join(current_dir, txt_files[choice - 1])
                console.print(
                    f"[green]✓[/green] Selected: [white]{txt_files[choice - 1]}[/white]"
                )
                return selected_file
            else:
                console.print("[red]✗ Invalid number. Try again.[/red]")
        except (ValueError, KeyboardInterrupt):
            console.print("\n[red]Cancelled by user.[/red]")
            sys.exit(0)


def extract_and_save_lines(
    log_file: str, domain: str, include_domain: bool
) -> tuple[list[str], str, int]:
    """Extract matching lines and save to file with Rich progress bar"""
    matching_lines: set[str] = set()
    output_dir = os.path.dirname(log_file)
    safe_domain = domain.replace(".", "_")
    filter_suffix = "_full" if include_domain else "_filtered"
    output_file = os.path.join(
        output_dir, f"Extracted_{safe_domain}{filter_suffix}.txt"
    )

    console.print("\n")
    console.rule("[bold cyan]⚡ PROCESSING[/bold cyan]", style="cyan")
    console.print(
        f"\n[blue]📖[/blue]  Reading: [bold cyan]{os.path.basename(log_file)}[/bold cyan]"
    )
    console.print(
        f"[blue]🔍[/blue]  Looking for: [bold yellow]{domain}[/bold yellow]\n"
    )

    total_scanned = 0

    try:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console,
        ) as progress:
            # Count total lines first
            with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
                total_lines = sum(1 for _ in f)

            task = progress.add_task("🔍 Scanning file...", total=total_lines)

            with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    total_scanned += 1
                    progress.update(task, advance=1)

                    if domain in line.lower():
                        processed_line = line.strip()

                        # Remove domain from line if requested
                        if not include_domain:
                            processed_line = processed_line.replace(domain, "")
                            processed_line = processed_line.replace(domain.upper(), "")
                            processed_line = processed_line.replace(domain.title(), "")
                            processed_line = processed_line.replace("/:", "")
                            processed_line = (
                                processed_line.strip().strip(":").strip("/").strip()
                            )

                        # Add "Property of Tdjs " prefix to every line
                        if processed_line:
                            branded_line = f"Property of Tdjs {processed_line}"
                            matching_lines.add(branded_line)

    except Exception as e:
        console.print(f"[red]✗ Error reading file: {e}[/red]")
        return [], output_file, total_scanned

    console.print(f"[green]✓[/green] Scanned {total_scanned:,} lines total")

    sorted_lines = sorted(list(matching_lines))

    try:
        with open(output_file, "w", encoding="utf-8") as out_f:
            for line in sorted_lines:
                out_f.write(line + "\n")
        console.print(
            f"[green]✓[/green] Saved to: [white]{os.path.basename(output_file)}[/white]"
        )
    except Exception as e:
        console.print(f"[red]✗ Error saving file: {e}[/red]")
        return [], output_file, total_scanned

    return sorted_lines, output_file, total_scanned


def main():
    """Main function"""
    try:
        print_banner()

        # Step 1: Select domain
        selected_domain = select_domain()

        # Step 2: Select if domain should be included in output
        include_domain = select_filter_option()

        # Step 3: Select input file
        log_file = detect_and_select_log_file()

        # Step 4: Extract and save
        extracted_lines, output_file, total_scanned = extract_and_save_lines(
            log_file, selected_domain, include_domain
        )

        # Step 5: Display results
        console.print("\n")
        console.rule("[bold cyan]📊 RESULTS[/bold cyan]", style="cyan")

        if extracted_lines:
            match_rate = (
                (len(extracted_lines) / total_scanned * 100) if total_scanned > 0 else 0
            )

            # Create stats table
            stats_table = Table(show_header=False, box=box.SIMPLE, padding=(0, 2))
            stats_table.add_column("Metric", style="white", width=20)
            stats_table.add_column("Value", style="bold")

            stats_table.add_row(
                "Total lines scanned:", f"[cyan]{total_scanned:,}[/cyan]"
            )
            stats_table.add_row(
                "Matches found:", f"[green]{len(extracted_lines):,}[/green]"
            )
            stats_table.add_row("Match rate:", f"[yellow]{match_rate:.4f}%[/yellow]")
            stats_table.add_row(
                "Output file:", f"[magenta]{os.path.basename(output_file)}[/magenta]"
            )

            console.print("\n[green]📊 STATISTICS[/green]")
            console.print(stats_table)

            # Preview
            console.print(
                f"\n[yellow]📋 PREVIEW (first {min(PREVIEW_LINES, len(extracted_lines))} lines)[/yellow]"
            )

            preview_table = Table(
                show_header=False, box=box.SIMPLE, padding=(0, 1), show_edge=False
            )
            preview_table.add_column("No.", style="dim", width=4)
            preview_table.add_column("Line", style="cyan")

            for i, line in enumerate(extracted_lines[:PREVIEW_LINES], 1):
                display_line = line if len(line) <= 70 else line[:67] + "..."
                preview_table.add_row(f"{i}.", display_line)

            console.print(preview_table)

            if len(extracted_lines) > PREVIEW_LINES:
                remaining = len(extracted_lines) - PREVIEW_LINES
                console.print(f"[dim]... and {remaining} more lines[/dim]")

            console.print("\n[green bold]✅ SUCCESS! All done![/green bold]")
            console.print("[cyan]🔥 Check the output file for full results![/cyan]\n")
        else:
            console.print(
                f"[yellow]⚠[/yellow]  No matching lines found for domain: [white]{selected_domain}[/white]"
            )
            console.print(
                f"[blue]ℹ[/blue]  Empty file saved to: [white]{os.path.basename(output_file)}[/white]"
            )
            console.print(
                "[yellow]⚠[/yellow]  Please check your input file or try a different domain.\n"
            )

    except KeyboardInterrupt:
        console.print("\n\n[red]Program interrupted by user. Goodbye![/red]\n")
        sys.exit(0)
    except Exception as e:
        console.print(f"[red]✗ Unexpected error: {e}[/red]")
        sys.exit(1)


if __name__ == "__main__":
    main()
