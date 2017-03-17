var gulp=require("gulp");
var changed=require("gulp-changed");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;

// copies all js files to htd/js
gulp.task("html", function () {
  // copy js files
  return gulp.src([
    src+"html/*.html",
    src+"tpl/CNAME",
    src+"tpl/browserconfig.xml",
    src+"tpl/humans.txt",
    src+"tpl/robots.txt",
  ])
  .pipe(changed(dbg))
  .pipe(gulp.dest(dbg));
});
