// TODO: _testgulpfile.jsを参考にアローfunctionで書き換える

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

function buildPug() {
  const pugFilter = filter(['**/*.pug', '!**/_*.pug'], { restore: true });
  return src(['src/pug/*.pug', 'src/pug/**/*.pug'])
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
	  .pipe(gulp.dest('./public/'))
}

function buildCss() {
  return src('src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('./public/stylesheets/'));
}

function buildJavascript() {
  return src(['src/javascript/**/*.js', 'src/javascript/*.js'])
    .pipe(browserify())
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(dest('public/js/'));
}

function watchPug() {
	return gulp
		.watch(['src/pug/**/*.pug', 'src/pug/*.pug'])
		.on('change', gulp.series(buildPug, browserReload));
  }
  
  function watchCss() {
	return gulp
	  .watch(['src/scss/*.scss', 'src/scss/**/*.scss'])
	  .on('change', browserSync.reload);
  }
  
  function watchJavascript() {
	return gulp
	  .watch(['src/javascript/*.js', 'src/javascript/**/*.js'])
	  .on('change', browserSync.reload);
  }

// function watchPug() {
//   return gulp
//     .watch(['src/pug/**/*.pug', 'src/pug/*.pug'])
//     .on('change', function () {
//       return gulp.series(browserSync.reload);
//     });
// }

// function watchCss() {
//   return gulp
//     .watch(['src/scss/*.scss', 'src/scss/**/*.scss'])
//     .on('change', function () {
//       return series(browserSync.reload);
//     });
// }

// function watchJavascript() {
//   return gulp
//     .watch(['src/javascript/*.js', 'src/javascript/**/*.js'])
//     .on('change', browserSync.reload);
// }

function browserSyncFunction() {
	return browserSync.init({
	  server: {
		baseDir: './public/',
	  },
	  port: '8000',
	  ui: false,
	}, function(err, bs) {
	  console.log(bs.options.get('urls').get('local'));
	});
}
  
const browserReload = (done) => {
	browserSync.reload()
	done()
  }

exports.build = parallel(buildPug, buildCss, buildJavascript);

exports.watch = parallel(watchPug, watchCss, watchJavascript);

exports.default = parallel(exports.build, exports.watch, browserSyncFunction);
