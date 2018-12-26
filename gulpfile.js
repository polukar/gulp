'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const svgSprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const stream = browserSync.stream();
const reload = browserSync.reload();

function stylesLibs(done) {
  gulp.src('./src/sass/libs.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(minify())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./build/css'));
  done();
}

function styles(done) {
  gulp.src('./src/sass/main.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'))
    .pipe(stream);
  done();
}

function script(done) {
  gulp.src('./src/js/index.js')
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./build/js'))
    .pipe(stream);
  done();
}

function html(done) {
  gulp.src('./src/pug/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest('./build'));
  done();
}

function sprite(done) {
  gulp.src('./src/img/sprites/*.svg')
    .pipe(svgSprite({
      mode: {
        css: {
          render: {
            css: true
          }
        }
      }
    }))
    .pipe(gulp.dest('./build/img'));
  done();
}

function browserReload(done) {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  done();
}

// function img() {

// }

gulp.task('styleLibs', stylesLibs);
gulp.task('styles', styles);
gulp.task('script', script);
gulp.task('html', html);
gulp.task('sprite', sprite);
gulp.task('browserReload', browserReload);

function watch(done) {
  gulp.watch('./src/sass/**/*.scss', gulp.parallel('styles'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('script'));
  gulp.watch('./src/pug/**/*.pug', gulp.parallel('html'), reload);
  done();
}

gulp.task('watch', watch, gulp.parallel(browserReload));


gulp.task('default', gulp.parallel('styleLibs', 'styles', 'script', 'sprite', 'browserReload', 'html', 'watch'), false);




