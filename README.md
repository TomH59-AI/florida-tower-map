# SkyWave — Florida Live Tower Map

Interactive map showing every cell tower and antenna in the State of Florida using live OpenCellID data.

## Features

- **Dark-themed map** with custom tower waypoint markers
- **Color-coded by radio type** — LTE (green), 5G NR (purple), UMTS (blue), GSM (gold), CDMA (pink)
- **Hover popups** with carrier name, cell ID, LAC/TAC, range, signal strength, coordinates
- **Carrier identification** — maps MCC/MNC codes to AT&T, T-Mobile, Verizon, Sprint, etc.
- **Smart tile loading** — auto-splits the viewport into tiles to stay within API limits
- **Marker clustering** — handles dense urban areas without choking the browser
- **Live stats bar** — real-time count by radio technology
- **Server-side proxy** — OpenCellID token never exposed to the browser

## Run It

```bash
npm install
npm start
# Open http://localhost:3000
```

## Deploy to Railway

1. Push to GitHub
2. Connect repo in Railway
3. Set env var: `OPENCELLID_TOKEN=pk.6d4e560229de9121955a48aa246647b2`
4. Deploy

## Files

- `server.js` — Express server + OpenCellID API proxy
- `public/index.html` — Full map frontend (Leaflet + MarkerCluster)
- `.env` — Token and port config
- `package.json` — Dependencies

## Built by SkyWave LLC — The Crushers 🗼
