var gulp=require("gulp");
var changed=require("gulp-changed");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;

// copies all html files to htd
gulp.task("html", function () {
  // copy js files
  return gulp.src([
    src+"html/**/*.html",
  ])
  .pipe(changed(dbg))
  .pipe(gulp.dest(dbg));
});