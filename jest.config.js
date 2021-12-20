const { default: tsjPreset } = require('ts-jest/presets');
module.exports = {
    preset: 'ts-jest',
    rootDir: './',
    testRegex: '(/test/.*\\.(test|spec))\\.[tj]sx?$',
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx"
    ]
}