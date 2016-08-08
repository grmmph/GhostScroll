var gulp = require('gulp')

var cssnano = require('gulp-cssnano')
var sass = require('gulp-sass')

gulp.task('sass', function() {
  return gulp.src('assets/sass/*.+(sass|scss)')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('assets/css/'))
})

gulp.task('build', [ 'sass' ])

gulp.task('watch', function() {
  gulp.watch('assets/sass/**/*.+(sass|scss)', ['sass'])
})

gulp.task('default', [ 'build', 'watch' ])

