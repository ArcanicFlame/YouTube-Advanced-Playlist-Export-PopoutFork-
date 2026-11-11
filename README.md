# YouTube Advanced Playlist Export

A lightweight Manifest V3 browser extension for exporting YouTube playlist metadata into clean **JSON**, **CSV**, or **TXT** files directly from your browser.

> Forked and modernized from [piniek435/YouTube-Advanced-Playlist-Export](https://github.com/piniek435/YouTube-Advanced-Playlist-Export) under the MIT License.

## Features
* **Multi-Format Export:** Save playlist entries as structured `.json`, spreadsheet-ready `.csv` (with UTF-8 BOM and proper quote escaping), or human-readable `.txt`.
* **Dual-View Support:** Works on both full playlist pages (`://youtube.com...`) and active watch-page playlist panels (`://youtube.com...`).
* **Smart Filenames:** Automatically extracts and sanitizes the playlist title alongside its unique `list` ID (`Playlist_Title_[PLxxxx].csv`).
* **Resilient Parsing:** Safely handles unavailable (`[Deleted video]` / `[Private video]`) rows and excludes recommended shelf sections from polluting your export.
* **Privacy-First:** Runs 100% locally in your active tab with zero external API keys, tracking, or background network requests.

## Extracted Metadata Fields

| Field | Full Playlist Page | Watch Side Panel |
| :--- | :---: | :---: |
| **Title** | ✅ | ✅ |
| **Author / Channel** | ✅ | ✅ |
| **Duration** | ✅ | ✅ |
| **Video ID & URL** | ✅ | ✅ |
| **Thumbnail URL** | ✅ | ✅ |
| **View Count** | ✅ | — |
| **Published Date** | ✅ | — |

## Usage
1. Open any YouTube playlist page or watch a video inside a playlist.
2. **Scroll down** to the bottom of the playlist so YouTube loads all paginated entries (YouTube loads 100 videos per scroll batch).
3. Click the extension icon in your browser toolbar and choose **Save to JSON**, **Save to TXT**, or **Save to CSV**.

## Manual Installation (Developer Mode)
1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`) in your browser.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select this repository's root folder.

## License
Distributed under the MIT License. See `LICENSE` for more information.
