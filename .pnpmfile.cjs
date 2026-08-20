function readPackage(pkg, context) {
  if (pkg.dependencies && pkg.dependencies.lightningcss) {
    pkg.dependencies.lightningcss = "1.30.1";
  }
  if (pkg.devDependencies && pkg.devDependencies.lightningcss) {
    pkg.devDependencies.lightningcss = "1.30.1";
  }
  if (pkg.peerDependencies && pkg.peerDependencies.lightningcss) {
    pkg.peerDependencies.lightningcss = "1.30.1";
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
