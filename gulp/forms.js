var gulp=require("gulp");
var changed=require("gulp-changed");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;

// copies all js files to htd/js
gulp.task("forms", function () {
  // copy js files
  return gulp.src([
    src+"forms/2017/*.pdf",
  ])
  .pipe(changed(dbg+"forms"))
  .pipe(gulp.dest(dbg+"forms"));
});