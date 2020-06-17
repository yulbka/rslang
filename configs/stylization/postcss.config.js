const path = require('path');
const root = path.resolve(__dirname, '../../');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('postcss-import')({
      resolve: (id, basedir) => {
        const alias = [
          { name: 'css', toPath: 'src/css' },
          { name: 'img', toPath: 'src/img' },
          { name: 'node_modules', toPath: 'node_modules' },
        ];

        for (const { name, toPath } of alias) {
          if (id.substr(0, name.length) === name) {
            return `${root}/${toPath}/${id.substr(name.length + 1)}`;
          }
        }

        return path.resolve(basedir, id);
      },
    }),
    require('postcss-advanced-variables')(),
    require('postcss-preset-env')({
      stage: 1,
      preserve: true,
      autoprefixer: {
        grid: 'autoplace',
      },
    }),
    require('postcss-property-lookup')(),
    require('postcss-nested')({ preserveEmpty: true }),
    require('postcss-color-function')(),
    require('postcss-selector-not')(),
    require('postcss-selector-matches')(),
    require('postcss-svg')({ dirs: [`${root}/src/img`], svgo: {} }),
    require('postcss-line-height-px-to-unitless')(),
    require('postcss-pxtorem')({
      propList: ["font", "font-size", "line-height", "letter-spacing"],
      rootValue: 16,
      replace: true,
      mediaQuery: false,
    }),
    require('postcss-assets')({ loadPaths: ['img/'] }),
    require('css-mqpacker')({ sort: true }),
    isProd && require('cssnano')(),
  ].filter(Boolean),
};
