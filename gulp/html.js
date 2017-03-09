var gulp=require("gulp");
var changed=require("gulp-changed");

// get process environment vars
var src=process.env.src;
var dbg=process.env.dbg;

// copies all js files to htd/js
gulp.task("html", function () {
  // copy js files
  return gulp.src([
    src+"html/index.html",
    src+"html/404.html",
    src+"tpl/CNAME",
    src+"tpl/browserconfig.xml",
    src+"tpl/humans.txt",
    src+"tpl/robots.txt",
  ])
  .pipe(changed(dbg))
  .pipe(gulp.dest(dbg));
});
