'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const svgSprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

function stylesLibs(done) {
  gulp.src('./src/sass/libs.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(minify())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./build/css'));
  browserSync.reload();
  done();
}

function styles(done) {
  gulp.src('./src/sass/main.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
  browserSync.reload();
  done();
}

function script(done) {
  gulp.src('./src/js/index.js')
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./build/js'));
  browserSync.reload();
  done();
}


function scripts(done) {
  gulp.src([
    './node_modules/matter-js/build/matter.js',
    './node_modules/p5/p5.js'
  ])
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('./build/js'));
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


gulp.task('styleLibs', stylesLibs);
gulp.task('styles', styles);
gulp.task('script', script);
gulp.task('sketch', sketch);
gulp.task('scripts', scripts);
gulp.task('html', html);
gulp.task('sprite', sprite);
gulp.task('browserReload', browserReload);

function watch(done) {
  gulp.watch('./src/sass/**/*.scss', gulp.parallel('styles'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('script'));
  gulp.watch('./src/js/sketch.js', gulp.parallel('sketch'));
  gulp.watch('./src/pug/**/*.pug', gulp.parallel('html'));
  done();
}

gulp.task('watch', watch);


gulp.task('default', gulp.parallel('styleLibs', 'styles', 'script', 'scripts', 'sprite', 'browserReload', 'html', 'watch'), false);




