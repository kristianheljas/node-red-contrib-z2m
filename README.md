# node-red-contrib-zigbee2mqtt

A collection on [Node-RED](https://nodered.org/) nodes interfacing with [Zigbee2MQTT](https://www.zigbee2mqtt.io/).

Inspired by [node-red-contrib-zigbee2mqtt](https://flows.nodered.org/node/node-red-contrib-zigbee2mqtt) with following key differences:

- Written in Typescript
- Uses built-in Node-RED MQTT configuration nodes
- Uses the new [Zigbee2MQTT API](https://www.zigbee2mqtt.io/information/mqtt_topics_and_message_structure.html)

## A word of caution

This project is work in progress and might be subject to change dramatically.

Right now, it lives in "personal pet project" status, which I do use to automate my home with, so you can expect some stability :)

## Example

Currently, only few nodes are available:

![example-flow.png](/docs/examples/example-flow.png)

View source: [example-flow.json](/docs/examples/example-flow.json)

## Quickstart

See [Node-RED docs](https://nodered.org/docs/user-guide/runtime/adding-nodes) about how to install nodes using NPM or package.json

But in the gist it is just:

```sh
# Navigate to node-red userDir (yours might differ!)
cd $HOME/.node-red

# Install this package
npm install node-red-contrib-z2m

# Restart Node-RED!
```

## Developer quickstart

```sh
# Clone this repository
git clone https://github.com/kristianheljas/node-red-contrib-zigbee2mqtt
cd node-red-contrib-zigbee2mqtt

# Install dependencies (also installs husky git hooks)
yarn

# Compile sources (--dev enables sourceMaps, useful for debugging)
yarn build --dev

# Install this repository locally
cd /path/to/node-red-user-dir
npm install /path/to/node-red-contrib-zigbee2mqtt
```

To automatically watch for file changes run `yarn gulp watch` instead (also supports `--dev flag`)

## Development server

You can run integrated node-red devlopment server by running `yarn gulp start`, which will:

1. Compile all sources & copy static assets
2. Run node-red development server
3. Automatically compile and restart the server on file changes

By default the development server listens on port `1880`, but can be configured via `PORT` enviroment variable (ie. `PORT=8080 yarn gulp start`).

The development server stores it's data and configuration inside `.node-red/` directory.

## Development

```sh
# Start local node-red instance & watch for file changes
yarn gulp start

## EDIT SOURCES ##

# Commit changes
git add .
git commit # runs lint-staged and commitlint automatically

# Push changes
git push
```

You can also run linting and formatting manually using:

```sh
# Fix eslint problems
yarn lint

# Format code using prettier
yarn format
```

## Convetional commits

This project is enforcing [Conventional Commits](https://www.conventionalcommits.org/en/).

`@commitlint/config-conventional` conguration is used, which is based on [the Angular convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

### Quick examples

- `feat: new feature`
- `fix(scope): bug in scope`
- `feat!: breaking change in API`
- `chore(deps): update dependencies`

### Commit types

- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci`: Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **`chore`: Changes wich doesn't change source code or tests e.g. chnages to the build process, auxiliary tools, libraries**
- `docs`: Documentation only changes
- **`feat`: A new feature**
- **`fix`: A bug fix**
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: Revert something
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests
