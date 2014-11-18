var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var exec = require('gulp-exec');

gulp.task('jshint', function() {
	return gulp.src('js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
	return gulp.src('tests/**/*.js')
		.pipe(mocha({ reporter: 'dot' }));
});

gulp.task('browserify', ['jshint', 'test'], function() {
	return gulp.src('js/main.js')
		.pipe(browserify({}))
		.pipe(gulp.dest('./build'));
});

gulp.task('paper', function(cb) {
    var options = {
        continueOnError: false,
        pipeStdout: false
    };
    var reportOptions = {
        err: true,
        stderr: true,
        stdout: true
    };
    gulp.src('paper/main.tex')
        .pipe(exec('pdflatex -output-directory paper/ <%= file.path %>'))
        .pipe(exec.reporter(reportOptions));
});

gulp.task('default', ['jshint', 'test', 'browserify']);

gulp.task('watch', ['default'], function() {
	gulp.watch('js/*', ['default']);
	gulp.watch('tests/*', ['test']);
});
