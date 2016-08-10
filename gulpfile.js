var fs = require('fs')
var gulp = require('gulp')

var cssnano = require('cssnano')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var penthouse = require('penthouse')

var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

gulp.task('sass', function() {
  return gulp.src('assets/sass/*.+(sass|scss)')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%']
    }))
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

gulp.task('scripts', function() {
  gulp.src([ 'assets/js/src/jquery-3.1.0.min.js', 'assets/js/src/index.js' ])
    .pipe(concat('index.min.js'))
    .pipe(gulp.dest('assets/js/'))
})

gulp.task('scripts-production', function() {
  gulp.src([ 'assets/js/src/jquery-3.1.0.min.js', 'assets/js/src/index.js' ])
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
})

gulp.task('build', [ 'sass', 'penthouse', 'scripts' ])
gulp.task('production', [ 'sass', 'penthouse', 'scripts-production' ])

gulp.task('watch', function() {
  gulp.watch('assets/sass/**/*.+(sass|scss)', ['sass', 'penthouse' ])
  gulp.watch('assets/js/src/**/*.js', [ 'scripts' ])
})


gulp.task('default', [ 'build', 'watch' ])

