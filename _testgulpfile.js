const { series, parallel } = require('gulp')
const gulp = require('gulp')

const browserSync = require('browser-sync')

const server = () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
    startPath: './_sandbox/',
    port: 8080,
    reloadOnRestart: true,
  })
}

const browserReload = (done) => {
  browserSync.reload()
  done()
}

const watchHTML = (done) => {
  gulp.watch('./**/*.html', series(browserReload))
  done()
}

const watchCSS = (done) => {
  gulp.watch('./**/*.css', series(browserReload))
  done()
}

const watchJS = (done) => {
  gulp.watch('./**/*.js', series(browserReload))
  done()
}

exports.default = parallel(watchCSS, watchJS, watchHTML, server)