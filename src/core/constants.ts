import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson: PackageJson = require('../../package.json');

export const PACKAGE_NAME = packageJson.name as string;
export const PACKAGE_VERSION = packageJson.version as string;
export const PACKAGE_NODES = packageJson['node-red'].nodes as Record<string, string>;

export default {
  PACKAGE_NAME,
  PACKAGE_VERSION,
  PACKAGE_NODES,
};
