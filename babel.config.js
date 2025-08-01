module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  plugins.push([
    '@tamagui/babel-plugin',
    {
      components: ['tamagui'],
      config: './tamagui.config.ts',
    },
  ],
  ['module:react-native-dotenv']

);

  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
