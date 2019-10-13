const gulp = require("gulp"); // Load Gulp!
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const prettyError = require('gulp-prettyerror');
//Sass required element -  https://www.npmjs.com/package/gulp-sass
const sass = require('gulp-sass');
//Minify CSS -  https://www.npmjs.com/package/gulp-uglifycss
const uglifycss = require('gulp-uglifycss')


/*
-- TOP LEVEL FUNCTIONS --
    gulp.task - Define tasks
    gulp.src - Point to files to use
    gulp.dest - Points to folder to output
    gulp.watch - Watch files and folder for changes

*/

gulp.task("scripts", function() {
  return gulp
    .src("./js/*.js") 
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(terser()) // Call the terser function on these files
    .pipe(rename({ extname: ".min.js" })) // Rename the uglified file
    .pipe(gulp.dest("./build/js"));
});

;

// Create Sass task for compiling Sass
gulp.task('sass', function(done) {
  return gulp
  .src('./sass/*.scss', { sourcemaps: true })
  .pipe(sourcemaps.init())
  .pipe(prettyError())
  .pipe(sass())
  .pipe(
    autoprefixer({
      browsers: ['last 2 versions']
    })
  )
  .pipe(uglifycss())
  .pipe(rename('style.min.css'))
  .pipe(sourcemaps.write('../maps'))
  .pipe(gulp.dest('./build/css'));
});


gulp.task('reload', function(done) {
    browserSync.reload();
    done();
});

gulp.task("watch", function() {
    gulp.watch("js/*.js", gulp.series("scripts", 'reload'));
    gulp.watch('sass/*.scss', gulp.series('sass', 'reload'));
});


// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
});
gulp.task("default", gulp.parallel("browser-sync", "watch"));
