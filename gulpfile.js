const $gulp = require('gulp');
const $del = require('del');
const $gulpRename = require('gulp-rename');
const $gulpBrowserify = require('gulp-browserify');
const $gulpUglify = require('gulp-uglify');

$gulp.task('clean-cover', () => $del(['./docs-dist/coverage']));

$gulp.task('build-js', () => {
  const flow = $gulp.src([
    './index.js',
  ]).pipe($gulpBrowserify({
    standalone: 'spore-kit',
    debug: true,
  }))
    .pipe($gulpRename('spore-kit.js'))
    .pipe($gulp.dest('./dist'))
    .pipe($gulp.dest('./docs/public'));
  return flow;
});

$gulp.task('build-js-min', () => {
  const flow = $gulp.src([
    './index.js',
  ])
    .pipe($gulpBrowserify({
      standalone: 'spore-kit',
      debug: true,
    }))
    .pipe($gulpUglify())
    .pipe($gulpRename('spore-kit.min.js'))
    .pipe($gulp.dest('./dist'))
    .pipe($gulp.dest('./docs/public'));
  return flow;
});

$gulp.task('default', $gulp.series([
  'build-js',
  'build-js-min',
]));
