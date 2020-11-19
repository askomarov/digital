const gulp = require("gulp");
const plumber = require("gulp-plumber"); //обработчик ошибок
const sourcemap = require("gulp-sourcemaps"); //добавляет карты кода для css
const htmlmin = require('gulp-htmlmin'); //минификация html
const sass = require("gulp-sass"); //делает из scss - css
const postcss = require("gulp-postcss"); //библиотека со своими настройками
const autoprefixer = require("autoprefixer"); //префиксы проставляет
const sync = require("browser-sync").create();
const fileinclude = require('gulp-file-include');
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const imageminJpegtran = require('imagemin-jpegtran');
const imageminSvgo = require('imagemin-svgo');
const csso = require("gulp-csso"); //минификация стилей
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const del = require("del");
const terser = require("gulp-terser"); //обратка и минифик файлов js
const { series, parallel } = require('gulp');

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: "docs/"
    },
    port: 3000,
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;


//svg sprite
const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("docs/img"))
};
exports.sprite = sprite;

//webp
const makewebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 70 }))
    .pipe(gulp.dest('source/img'))
};
exports.makewebp = makewebp;

//images
const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}") //** - смотрит в любую вложенность
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      // imageminJpegtran({ progressive: true }),
      imagemin.svgo()
    ]));
};
exports.images = images;

// HTMl
const html = (params) => {
  return gulp.src("source/*.html")
    .pipe(fileinclude())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('docs'))
    .pipe(sync.stream());
};
exports.html = html;

// Styles
const styles = (params) => {
  return gulp.src("source/scss/style.scss") //находим файлы в папке и какой файл
    .pipe(plumber())// перерабатываем через функцию кидаем файл в трубу
    .pipe(sourcemap.init())//еще переработки через функции
    .pipe(sass()) //получаем готовый файл css
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("docs/css"))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write(".")) //положил файл с картами кодами в корневую папку
    .pipe(gulp.dest("docs/css")) //галп положи файлы в папку.
    .pipe(sync.stream());
};
exports.styles = styles;  //говорим галпу что есть теперь такая задача

//javascript
const scripts = () => {
  return gulp.src('source/js/script.js')
    .pipe(terser())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('docs/js'))
    .pipe(sync.stream());
}
exports.scripts = scripts;

//copy
const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("docs"));
};
exports.copy = copy;

//clean
const clean = (params) => {
  return del("docs");
};
exports.clean = clean;

function cb() {
}

// Watcher
const watcher = () => {
  gulp.watch(["source/**/*.html"], gulp.series("html"));
  gulp.watch(["source/js/**/*.js"], gulp.series("scripts"));
  gulp.watch(["source/scss/**/*.scss"], gulp.series("styles"));
};
exports.watcher = watcher;


//build
const build = gulp.series(clean, copy, gulp.parallel(html, styles, scripts, sprite));
exports.build = build;

let watch = gulp.parallel(build, watcher, server);
exports.watch = watch;
exports.default = watch;
