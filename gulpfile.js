const gulp = require('gulp');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
// const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const babel = require('gulp-babel');

// Handlebars Plugins
const handlebars = require('gulp-handlebars');
const handlebarsLib = require('handlebars');
const declare = require('gulp-declare');
const wrap = require('gulp-wrap');

// Image Compression
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

// File paths
let DIST_PATH = 'public/dist';
let SCRIPTS_PATH = 'public/scripts/**/*.js';
let CSS_PATH = 'public/css/**/*.css';
let TEMPLATES_PATH = 'templates/**/*.hbs';
let IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// // Styles
// gulp.task('styles', () => {
// 	console.log('starting styles task');
// 	return gulp.src(['public/css/reset.css',CSS_PATH])
// 	// .pipe(plumber( function(err) {
// 	// 	console.log('Styles task Error', err);
// 	// 	this.emit('end');
// 	// }))
// 	.pipe(sourcemaps.init())
// 	.pipe(autoprefixer())
// 	.pipe(concat('styles.css'))
// 	.pipe(cleanCSS())
// 	.pipe(sourcemaps.write())
// 	.pipe(gulp.dest(DIST_PATH))
// 	.pipe(livereload());
// });

// Styles for SASS
gulp.task('styles', () => {
	console.log('starting styles task');
	return gulp.src('public/scss/styles.scss')
	.pipe(sourcemaps.init())
	.pipe(autoprefixer())
	.pipe(sass({
		outputStyle: 'compressed'
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(DIST_PATH))
	.pipe(livereload());
});

// Scripts
gulp.task('scripts', () => {
	console.log('starting scripts task');
	return gulp.src(SCRIPTS_PATH)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(uglify())
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

// Images
gulp.task('images', () => {
	console.log('starting images task');
	return gulp.src(IMAGES_PATH)
	.pipe(imagemin([
		imagemin.gifsicle(),
		imagemin.jpegtran(),
		imagemin.optipng(),
		imagemin.svgo(),
		imageminPngquant(),
		imageminJpegRecompress()
		]))
	.pipe(gulp.dest(DIST_PATH + '/images'));
});

// Templates
gulp.task('templates', () => {
	return gulp.src(TEMPLATES_PATH)
		.pipe(handlebars({
			handlebars: handlebarsLib
		}))
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
			namespace: 'templates',
			noRedeclare: true
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest(DIST_PATH))
		.pipe(livereload());
});

gulp.task('default', ['images','scripts','styles','templates'], () => {
	console.log('Starting default task');
});

gulp.task('watch',['default'], () => {
	console.log('Starting Watch Task!');
	require('./server.js');
	livereload.listen();
	gulp.watch('./public/scripts/**/*.js', ['scripts']);
	// gulp.watch(CSS_PATH, ['styles']);
	gulp.watch('./public/scss/**/*.scss',['styles']);
	gulp.watch('./templates/**/*.hbs', ['templates']);
});