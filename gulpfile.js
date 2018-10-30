const $gulp = require('gulp');
// const $runSequence = require('run-sequence');
const $gulpRename = require('gulp-rename');
const $gulpBrowserify = require('gulp-browserify');

$gulp.task('build-js', function() {
	$gulp.src([
		'./index.js'
	])
		.pipe($gulpBrowserify({
			standalone: 'spore-kit',
			debug: false
		}))
		.pipe($gulpRename('spore-kit.js'))
		.pipe($gulp.dest('./dist'))
		.pipe($gulp.dest('./docs/assets'));
});

$gulp.task('default', [
	'build-js'
]);
