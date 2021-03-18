# node-red-contrib-zigbee2mqtt

## Quickstart

```sh
# Clone this repository
git clone https://github.com/kristianheljas/node-red-contrib-zigbee2mqtt
cd node-red-contrib-zigbee2mqtt

# Install dependencies (also installs husky git hooks)
yarn

# Compile soures
yarn build

# Install this repository locally
cd /path/to/node-red-user-dir
npm install /path/to/node-red-contrib-zigbee2mqtt
```

## Development

```sh
# Build & watch sources
yarn gulp watch

## EDIT SOURCES ##

# Commit changes
git add .
git commit # runs lint-staged using husky git hook

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
