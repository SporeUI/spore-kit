const $gulp = require('gulp');
const $runSequence = require('run-sequence');

$gulp.task('docs-build', () => {
	console.log('task:docs-build');
	// documentation 8.x api has bug:
	// https://github.com/documentationjs/documentation/issues/869
	// So use shell instead
});

$gulp.task('docs-default', () => $runSequence(
	'docs-build'
));

$gulp.task('default', [
	'docs-default'
]);
