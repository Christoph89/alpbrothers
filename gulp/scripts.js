var gulp=require("gulp");
var changed=require("gulp-changed");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;

// copies all js files to htd/js
gulp.task("scripts", function () {
  // copy js files
  return gulp.src([
    src+"vendor/jquery/*.js",
    src+"vendor/modernizr/modernizr.js",
    src+"vendor/skel/skel.js",
    src+"vendor/linq/linq.js",
    src+"js/main.js",
    src+"js/util.js",
  ])
  .pipe(changed(dbg+"js"))
  .pipe(gulp.dest(dbg+"js"));
});
