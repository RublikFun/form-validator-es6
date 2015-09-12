module.exports = {
  js: {
    src: ['./storyboarder/answer.js', './storyboarder/answers.js', './storyboarder/scene.js', './storyboarder/script.js'],
    guidelines: './gulp/config/.jshintrc',
    dest: './dist',
    name: 'storyboarder.js'
  },
  tests: {
    src: ['./spec/tests/*.js', './spec/fixtures/**/*', './dist/storyboarder.js'],
    dest: './tests/dist'
  },
  production: {
    src: ['./dist/storyboarder.js', './storyboarder/module.js'],
    name: 'storyboarder.min.js',
    dest: './dist'
  },
  karma: {
    config: '/gulp/config/karma.conf.js',
    tests: 'spec/tests/',
    fixtures: 'spec/fixtures/',
  },
};