# CastleCrush

*Description follows soon ...*

## Setup

### Development
1. Run `npm install`
2. Copy `config.sample.json` to `config.json` and edit to your needs
3. Run `npm start` (synonym for `npm run dev`) or without watch `npm run server` (run `npm run build` for building project)
4. Start develop

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
