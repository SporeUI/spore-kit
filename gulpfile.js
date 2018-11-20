const $gulp = require('gulp');
// const $runSequence = require('run-sequence');
const $del = require('del');
const $gulpRename = require('gulp-rename');
const $gulpBrowserify = require('gulp-browserify');
const $gulpUglify = require('gulp-uglify');

$gulp.task('clean-cover', () => $del(['./docs/coverage']));

$gulp.task('build-js', function() {
	$gulp.src([
		'./index.js'
	])
		.pipe($gulpBrowserify({
			standalone: 'spore-kit',
			debug: false
		}))
		.pipe($gulpRename('spore-kit.js'))
		.pipe($gulpUglify())
		.pipe($gulpRename('spore-kit.min.js'))
		.pipe($gulp.dest('./dist'))
		.pipe($gulp.dest('./docs/public'));
});

$gulp.task('default', [
	'build-js'
]);
