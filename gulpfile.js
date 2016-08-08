var fs = require('fs')
var gulp = require('gulp')

var cssnano = require('cssnano')
var gulpCssNano = require('gulp-cssnano')
var sass = require('gulp-sass')
var penthouse = require('penthouse')

gulp.task('sass', function() {
  return gulp.src('assets/sass/*.+(sass|scss)')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpCssNano())
    .pipe(gulp.dest('assets/css/'))
})

gulp.task('penthouse', ['sass'], function() {
  penthouse({
    url: "http://localhost:2368",
    css: "assets/css/main.css",
    width: 320,
    height: 568
  }, function(err, critical) {
    if(err) console.error(err)
    cssnano.process(critical, {}).then(function(result) {
      var wrappedCritical = "<style>" + result + "</style>"
      fs.writeFile('partials/critical-css.hbs', wrappedCritical)
    })
  })
})

gulp.task('build', [ 'sass', 'penthouse' ])

gulp.task('watch', function() {
  gulp.watch('assets/sass/**/*.+(sass|scss)', ['sass', 'penthouse'])
})


gulp.task('default', [ 'build', 'watch' ])

