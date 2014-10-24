var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat'); 

gulp.task('jshint', function() {
	return gulp.src('js/*')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('browserify', function() {
	return gulp.src('js/main.js')
		.pipe(browserify({}))
		.pipe(gulp.dest('./build'));
});


gulp.task('default', ['jshint', 'browserify']);

gulp.task('watch', ['default'], function() {
	gulp.watch('js/*', ['default']);
});
