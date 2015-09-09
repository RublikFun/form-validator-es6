module.exports = {
  js: {
    src: ['./storyboarder/answer.js', './storyboarder/answers.js', './storyboarder/scene.js', './storyboarder/script.js'],
    guidelines: './gulp/guidelines/.jshintrc',
    dest: './dist',
    name: 'storyboarder.js'
  },
  tests: {
    src: './tests/*.js',
    dest: './tests/dist'
  },
  production: {
    src: ['./dist/storyboarder.js', './storyboarder/module.js'],
    name: 'storyboarder.min.js',
    dest: './dist'
  },
};