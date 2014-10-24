var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('jshint', function() {
	return gulp.src('js/*')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
	return gulp.src('tests/*')
		.pipe(mocha({ reporter: 'dot' }));
});

gulp.task('browserify', ['jshint', 'test'], function() {
	return gulp.src('js/main.js')
		.pipe(browserify({}))
		.pipe(gulp.dest('./build'));
});


gulp.task('default', ['jshint', 'test', 'browserify']);

gulp.task('watch', ['default'], function() {
	gulp.watch('js/*', ['default']);
	gulp.watch('tests/*', ['test']);
});
