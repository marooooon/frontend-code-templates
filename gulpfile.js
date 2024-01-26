// TODO: _testgulpfile.jsを参考にアローfunctionで書き換える
// https://www.i-ryo.com/entry/2020/04/08/074158

const gulp = require('gulp');
const { src, dest } = require('gulp');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');
/*
    gulp-sass
    M1 Macではgulp-sassのgulp-saasのversionを5に上げる必要がある。
    const sass = require("gulp-sass");
*/
const sass = require('gulp-sass')(require('sass'));
const { parallel, series } = require('gulp');
const browserSync = require('browser-sync').create();

/*
    concat
    ファイル結合
*/
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const filter = require('gulp-filter');
const htmlbeautify = require('gulp-html-beautify');

/* ----- ここからBUILD ----- */

const buildPUG = (done) => {
  const pugFilter = filter(['**/*.pug', '!**/_*.pug'], { restore: true });
  console.log('PUG BUILD開始');
  gulp
    .src(['src/pug/*.pug', 'src/pug/**/*.pug'])
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(pugFilter)
    .pipe(pug())
    .pipe(
      htmlbeautify({
        eol: '\n',
        indent_size: 2,
        indent_char: ' ',
        indent_with_tabs: false,
        end_with_newline: true,
        preserve_newlines: true,
        max_preserve_newlines: 2,
        indent_inner_html: true,
        brace_style: 'collapse',
        indent_scripts: 'normal',
        wrap_line_length: 0,
        wrap_attributes: 'auto',
      })
    )
    .pipe(gulp.dest('./public/'));
  console.log('PUG BUILD終了');
  done();
};

const buildCSS = (done) => {
  console.log('CSS BUILD開始');
  gulp
    .src('src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('./public/css/'));
  console.log('CSS BUILD終了');
  done();
};

const buildJS = (done) => {
  console.log('JS BUILD開始');
  gulp
    .src(['src/javascript/**/*.js', 'src/javascript/*.js'])
    .pipe(browserify())
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(dest('public/js/'));
  console.log('JS BUILD終了');
  done();
};

/* ----- ここまでBUILD ----- */

/* ----- ここからWATCH ----- */

const watchPUG = (done) => {
  gulp.watch(['src/pug/**/*.pug', 'src/pug/*.pug'], series(buildPUG, browserReload));
  done();
};

const watchCSS = (done) => {
  gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], series(buildCSS, browserReload));
  done();
};

const watchJS = (done) => {
  gulp.watch(['src/javascript/*.js', 'src/javascript/**/*.js'], series(buildJS, browserReload));
  done();
};

/* ----- ここまでWATCH ----- */

const browserReload = (done) => {
  browserSync.reload();
  done();
};

function browserSyncFunction() {
  return browserSync.init(
    {
      server: {
        baseDir: './public/',
      },
      port: '8000',
      ui: false,
    },
    function (err, bs) {
      console.log(bs.options.get('urls').get('local'));
    }
  );
}

exports.build = parallel(buildPUG, buildCSS, buildJS);
exports.watch = parallel(watchPUG, watchCSS, watchJS);
exports.default = parallel(this.build, this.watch, browserSyncFunction);
