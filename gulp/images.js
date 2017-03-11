var gulp=require("gulp");
var changed=require("gulp-changed");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;

// copies all js files to htd/js
gulp.task("images", ["gallery", "favicon"], function () {
  // copy js files
  return gulp.src([
    src+"img/*.png",
    src+"img/*.jpg",
    src+"img/*.gif",
    src+"img/*.svg",
  ])
  .pipe(changed(dbg+"img"))
  .pipe(gulp.dest(dbg+"img"));
});

// copies all js files to htd/js
gulp.task("gallery", function () {
  // copy js files
  return gulp.src([
    src+"img/gallery/**/*",
  ])
  .pipe(changed(dbg+"img/gallery"))
  .pipe(gulp.dest(dbg+"img/gallery"));
});

// copies the favicon icons
gulp.task("favicon", function () {
  // copy js files
  return gulp.src([
    src+"img/favicon/*"
  ])
  .pipe(changed(dbg))
  .pipe(gulp.dest(dbg));
});
