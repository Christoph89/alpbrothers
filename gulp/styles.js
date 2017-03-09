var gulp=require("gulp");
var changed=require("gulp-changed");

// get process environment vars
var src=process.env.src;
var dbg=process.env.dbg;

// copies all css files to htd/css
gulp.task('styles', ["fonts"], function () {
  // copy css files
  return gulp.src([
    src+"sass/font.css",
  ])
  .pipe(changed(dbg+"css"))
  .pipe(gulp.dest(dbg+"css"));
});

// copies all fonts
gulp.task('fonts', function () {
  // copy font files
  return gulp.src([
    src+"fonts/*",
  ])
  .pipe(changed(dbg+"fonts"))
  .pipe(gulp.dest(dbg+"fonts"));
});
