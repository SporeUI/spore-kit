const $path = require('path');
const $fse = require('fs-extra');

const resolve = (dir) => {
  const root = $path.resolve(__dirname, '../');
  return $path.join(root, dir);
};

const docPackagePath = resolve('docs/packages');
$fse.ensureDirSync(docPackagePath);
