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
