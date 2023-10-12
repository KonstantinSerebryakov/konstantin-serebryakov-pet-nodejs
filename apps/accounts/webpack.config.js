const CopyPlugin = require("copy-webpack-plugin");
const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  // config.plugins.push(new CopyPlugin({
  //   patterns: [
  //     {
  //       from: "./src/prisma/client/",
  //       // to: "./dist/apps/accounts",
  //       filter: async (resourcePath) => {
  //         console.log(resourcePath)
  //         return resourcePath.includes('dll.node');
  //       },
  //     },
  //   ],
  // }));
  return config;
});
