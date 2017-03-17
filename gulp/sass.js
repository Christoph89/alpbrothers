var gulp=require("gulp");
var sass=require("gulp-sass");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;

// compiles the application's sass/scss files
gulp.task("sass", function () {
  // compile app.scss
  return gulp.src(src+"sass/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(dbg+"css"));
});
