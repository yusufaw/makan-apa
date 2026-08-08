# makan-apa

A Telegram bot (and small HTTP API) that randomly picks a food or restaurant
to answer the eternal question: *"makan apa?"* ("what should I eat?").

## How it works

- The food list lives in [`food.json`](./food.json) — each entry has a
  `name` and an `is_active` flag. Only active entries are eligible when the
  bot picks a random suggestion. The list is read and written on every
  request, so `/tambah` and `/hapus` take effect immediately. (This is a
  flat-file store for now; a database-backed store is planned for later.)
- [`src/store.js`](./src/store.js) reads/writes `food.json` and exposes
  `getListFood`, `addFood`, `removeFood`, and `searchFood`, used by both
  the bot and the HTTP server.
- [`index.js`](./index.js) wires everything together using
  [Telegraf](https://telegraf.js.org/) for the Telegram bot and
  [Express](https://expressjs.com/) for the HTTP server.

### Telegram bot commands

| Command          | Behavior                                                  |
| ----------------- | ---------------------------------------------------------- |
| `/start`          | Sends a welcome message                                    |
| `/about`          | Sends a link to this repo                                  |
| `/apa`            | Replies with one random **active** food                    |
| `/semua`          | Replies with the full food list                             |
| `/tambah <nama>`  | Adds `<nama>` to the food list (active by default)          |
| `/hapus <nama>`   | Removes `<nama>` from the food list (exact match, case-insensitive) |
| `/cari <kata>`    | Searches the food list for names containing `<kata>`        |

The bot also watches plain text messages: if a message contains
`makan apa`, `maem apa`, `lapar`, or `laper` (case-insensitive), it replies
with a random active food, same as `/apa`.

### HTTP endpoints

| Route     | Behavior                                          |
| --------- | -------------------------------------------------- |
| `GET /`   | Returns one random food (not filtered by `is_active`) |
| `GET /semua` | Returns the full food list                     |

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file with your Telegram bot token:
   ```
   TELEGRAM_BOT_TOKEN=your-bot-token-here
   PORT=3000
   ```
3. Run the bot:
   ```sh
   node index.js
   ```

## Deployment

[`deploy.sh`](./deploy.sh) SSHes into a configured host, pulls the latest
`main` branch, installs dependencies, and restarts the process with
[pm2](https://pm2.keymetrics.io/). It expects `HOST_USERNAME` and
`HOST_IP_ADDRESS` to be set in the environment.
