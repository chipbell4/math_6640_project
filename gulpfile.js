var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var exec = require('child_process').exec;
var del = require('del');
var async = require('async');

gulp.task('jshint', function() {
	return gulp.src('js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
	return gulp.src('tests/**/*.js')
		.pipe(mocha({ reporter: 'spec' }));
});

gulp.task('browserify', ['jshint', 'test'], function() {
	return gulp.src('js/main.js')
		.pipe(browserify({}))
		.pipe(gulp.dest('./build'));
});

gulp.task('paper', ['clean'], function(cb) {
    var latex = 'latex -halt-on-error main';
    var bibtex = 'bibtex main';
    var dvipdf = 'dvipdf main.dvi main.pdf';
    
    async.series([
        asyncCommand(latex),
        asyncCommand(bibtex),
        asyncCommand(latex),
        asyncCommand(latex),
        asyncCommand(dvipdf)
    ], cb);
});

// Converts a string command into an async exec call, to be chained with async.series
var asyncCommand = function(commandText) {
    return function(callback) {
        exec(commandText, {cwd: 'paper'}, callback);
    };
};

gulp.task('clean', function(cb) {
    del(['paper/**/*.{aux,bbl,blg,dvi,log,pdf}'], cb);
});

gulp.task('default', ['jshint', 'test', 'browserify', 'paper']);

gulp.task('watch', ['default'], function() {
	gulp.watch('js/**/*.js', ['default']);
	gulp.watch('tests/**/*.js', ['test']);
    gulp.watch(['paper/**/*.tex', 'paper/**/bib'], ['paper']);
});
