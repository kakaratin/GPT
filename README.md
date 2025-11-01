# KingDev Speech Tools Portal

This repository provides a lightweight portal for working with the tools hosted at
`https://cloud.kingdev.site/tool.php` alongside a built-in speech-to-text helper
adapted from the open-source
[Buster - Captcha Solver for Humans](https://github.com/dessant/buster) project.

## Features
- Embeds the remote KingDev tool in an iframe for quick access.
- Adds a Speech-to-Text panel that supports Wit.ai, Google Cloud, IBM Watson,
  and Microsoft Azure speech services.
- Reuses Buster's audio-preparation pipeline to trim silence and normalise
  audio challenges before sending them to the selected API.

## Usage
Open `index.html` in a modern browser (Chrome, Edge, or Firefox recommended).

1. Download or record the CAPTCHA audio challenge.
2. Choose your speech service and provide the required API credentials.
3. Drop the audio file into the form and click **Transcribe Audio**.

> **Note:** Some providers enforce CORS restrictions or quotas. Ensure your API
> keys are configured for browser use and have adequate quota before testing.

## Development Notes
- The frontend is plain HTML/CSS/ES modules; no build step is required.
- Audio processing depends on the Web Audio API and may require a secure origin
  (`https://` or `localhost`) in some browsers.

## Licensing

This project incorporates code from the Buster project and is therefore
distributed under the terms of the GNU General Public License v3.0. See
`LICENSE` and `third-party-notices.txt` for details.