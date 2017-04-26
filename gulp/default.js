var gulp=require("gulp");
var del=require("del");

// get process environment vars
var src=process.env.SRC;

// build task
gulp.task("build", ["scripts", "styles", "html", "images", "typescript", "sass", "forms"], function () {
  // just runs other tasks
});

// watches the files for changes and starts the appropriate task 
gulp.task("watch", ["build"], function () {
  gulp.watch(src+"**/*.js", ["scripts"]);
  gulp.watch(src+"**/*.css", ["styles"]);
  gulp.watch(src+"html/*.html", ["html"]);
  gulp.watch(src+"img/**/*", ["images"]);
  gulp.watch(src+"ts/**/*.ts", ["typescript"]);
  gulp.watch(src+"sass/**/*.scss", ["sass"]);
  gulp.watch(src+"forms/**/*", ["forms"]);
});

// cleans the project
gulp.task("clean", function () {
  return del([
    "docs",
    "docs_debug"
  ]);
});