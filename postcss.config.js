const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    plugins: {
        tailwindcss: {},
        'postcss-preset-env': {
            stage: 1
        },
        autoprefixer: {},
    }
}
