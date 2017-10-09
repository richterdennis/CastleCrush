# CastleCrush

CastleCrush is a little Game developed in connection with the [THM](https://www.thm.de/)

## Setup

### Installation
Choose the version you are want from the tags. Copy the files in the `_release` folder accordingly to your server and edit the config files.

### Development
1. Run `npm install`
2. Copy `_sample.config.client.json` to `config.client.json` and edit to your needs
3. Copy `_sample.config.server.json` to `config.server.json` and edit to your needs
4. Run `npm start` (synonym for `npm run dev`) or without watch `npm run server` (run `npm run build` for building project)
5. Start develop

## NPM Commands

| Command | Description |
| --- | --- |
| `npm start` | Runs `npm run dev` |
| `npm run dev` | Runs concurrently all watch tasks and `npm run server` |
| `npm run server` | Runs `node index.js` the server |
| `npm run build` | Runs all build tasks |
| `npm run build:<subtask>` | Runs a specific subtask of build (replace `<subtask>` with `html`, `css`, `js`, `public`) |
| `npm run watch` | Runs all watch tasks |
| `npm run watch:<subtask>` | Runs a specific subtask of watch (replace `<subtask>` with `html`, `css`, `js`, `public`) |

## License
This repository is licensed under the MIT license, more under
[LICENSE](LICENSE).
