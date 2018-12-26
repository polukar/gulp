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

function stylesLibs() {
  return gulp.src('./src/sass/libs.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(minify())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./build/css'));
}

function styles() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
}

function script() {
  return gulp.src('./src/js/main.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./build/js'));
}

function html() {
  return gulp.src('./src/pug/*.pug')
    .pipe(pug({}))
    .pipe(gulp.dest('./build'));
}

function sprite() {
  return gulp.src('./src/img/sprites/*.svg')
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
}

function img(){
  
}

gulp.task('styleLibs', stylesLibs);
gulp.task('styles', styles);
gulp.task('script', script);
gulp.task('html', html);
gulp.task('sprite', sprite);


