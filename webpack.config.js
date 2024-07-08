// webpack.config.js
module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader', // Ensure postcss-loader is used
          ],
        },
      ],
    },
  };
  