const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#034157', // Change the primary color to green
              '@link-color': '#097993',   // Change link color to green
              // Add or modify other theme variables here
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
