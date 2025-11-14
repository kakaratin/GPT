# Tdjs Leak Parser

This repository contains the **TdjsLeakParser** CLI utility for extracting domain-specific entries from plain-text log files while showcasing a colorful Rich-powered interface.

## Getting Started

1. Clone the repository locally:
   ```bash
   git clone <your-clone-url>
   cd <repo-directory>
   ```
2. (Optional) Create a virtual environment and install Rich if you do not already have it:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install rich
   ```
3. Run the parser:
   ```bash
   python tdjs_leak_parser.py
   ```

## Publishing to Your GitHub Account

If you received this project without a remote attached, follow these steps to publish it to your own GitHub repository:

1. Create a new empty repository on GitHub (do not initialize it with a README or license).
2. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   ```
3. Push the current branch to GitHub:
   ```bash
   git push -u origin work
   ```

Replace `<your-username>` and `<your-repo>` with your GitHub account details. After the initial push, subsequent pushes can use `git push` without additional options.
