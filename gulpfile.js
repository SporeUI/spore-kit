const $gulp = require('gulp');
// const $runSequence = require('run-sequence');
const $gulpBrowserify = require('gulp-browserify');

$gulp.task('build-js', function() {
	$gulp.src([
		'./index.js'
	]).pipe(
		$gulpBrowserify({
			standalone: 'spore-kit',
			debug: false
		})
	).pipe(
		$gulp.dest('./dist')
	).pipe(
		$gulp.dest('./docs/dist')
	);
});

$gulp.task('default', [
	'build-js'
]);
