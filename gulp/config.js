module.exports = {
  js: {
    src: './storyboarder_modules/*.js',
    guidelines: './gulp/guidelines/.jshintrc',
    dest: './dist'
  },
  tests: {
    src: './tests/*.js',
    dest: './tests/dist'
  },
  production: {
    src: './dist/storyboarder.js',
    name: 'storyboarder.min.js',
    dest: './dist'
  },
};