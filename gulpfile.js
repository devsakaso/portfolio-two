// common
const gulp = require('gulp');
const { series, parallel, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const plumber = require('gulp-plumber'); //監視ストップをしないようにする

// optional
const zip = require('gulp-zip'); //zip化
const del = require('del'); //distの中身削除

// css
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
// JS
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
// img
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
// html
const kit = require('gulp-kit');
const htmlmin = require('gulp-htmlmin');

// ファイルのパス
filesPath = {
  sass: './src/sass/**/*.scss',
  js: [
    './src/js/vendors/**.js',
    './src/js/libs/**.js',
    './src/js/scripts.js',
  ],
  images: './src/img/**/*.+(png|jpg|jpeg|gif|svg|ttf|woff|eot)',
  html: './html/**/*.kit',
};

// SASS
function sassTask() {
  return (
    gulp
      // .src(['./src/sass/init/*.scss', './src/sass/abstracts/*.scss','./src/sass/base/*.scss','./src/sass/components/*.scss','./src/sass/layout/*.scss','./src/sass/pages/*.scss'])
      .src(filesPath.sass)
      .pipe(plumber()) // errorによる監視のストップ防止
      // .pipe(sourcemaps.init()) //sourcemaps starts
      .pipe(sass()) //compile
      .pipe(autoprefixer()) //prefix
      .pipe(cssnano()) //minify
      // .pipe(sourcemaps.write('.')) //sourcemaps ends
      .pipe(
        rename(path => {
          // mapファイルにはminをつけたくないので。
          if (!path.extname.endsWith('.map')) {
            path.basename += '.min';
          }
        })
      )
      .pipe(dest('./dist/css'))
  );
}

// JavaScript
function jsTask() {
  return (
    gulp
      .src(filesPath.js)
      .pipe(plumber()) // errorによる監視のストップ防止
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      .pipe(concat('project.js'))
      .pipe(uglify()) //minify
      .pipe(
        rename({
          suffix: '.min',
        })
      )
      .pipe(dest('./dist/js'))
  );
}

// Images optimization
function imagesTask() {
  return gulp
    .src(filesPath.images)
    .pipe(cache(imagemin())) //imageを最適化、キャッシュを利用
    .pipe(dest('./dist/img/'));
}

// HTML kit templating
function kitTask() {
  return gulp
    .src(filesPath.html)
    .pipe(plumber()) // errorによる監視のストップ防止
    .pipe(kit()) //kitファイルをまとめる
    .pipe(
      htmlmin({
        //htmlをミニファイ化
        collapseWhitespace: true, //スペースを削除
      })
    )
    .pipe(dest('./'));
}

// Watch changes and browser-sync
function watch() {
  // browser-sync
  browserSync.init({
    server: {
      baseDir: './', //index.htmlをrootにおいている場合。
    },
    browser: 'google chrome',
  });
  // watch
  gulp.watch(filesPath.sass, sassTask).on('change', browserSync.reload);
  gulp.watch(filesPath.js, jsTask).on('change', browserSync.reload);
  gulp.watch(filesPath.html, kitTask).on('change', browserSync.reload);
  gulp.watch(filesPath.images, imagesTask).on('change', browserSync.reload);
}

// キャッシュのクリア
function clearCache() {
  return cache.clearAll();
}

// Zip化
function zipTask() {
  return gulp
    .src(['./**/*', '!./node_modules/**/*'])
    .pipe(zip('project.zip'))
    .pipe(gulp.dest('./'));
}

// Clean 'dist' folder
function clean() {
  return del(['./dist/**/*']);
}

// Gulp individual tasks
exports.sassTask = sassTask;
exports.jsTask = jsTask;
exports.imagesTask = imagesTask;
exports.kitTask = kitTask;
exports.watch = watch;
exports.clearCache = clearCache;
exports.zipTask = zipTask;
exports.clean = clean;

// Gulp serve
exports.build = parallel(sassTask, jsTask, imagesTask, kitTask);

// Gulp default command
exports.default = series(exports.build, watch);
