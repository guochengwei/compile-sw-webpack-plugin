
module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '8.9.0',
          },
        },
      ],
    ],
    overrides: [
      {
        test: './src/runtime',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: '0.12',
              },
            },
          ],
        ],
      },
    ],
  };
};
