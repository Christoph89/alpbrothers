var gulp=require("gulp");

// set process environment vars
process.env.src="src/"; // set source folder
process.env.dbg="docs_debug/"; // set debug output folder
process.env.release="docs/"; // set release output folder

// require other gulp files
var dependencies=["scripts", "styles", "html", "images", "typescript", "sass"];
for (var i=0; i<dependencies.length; i++)
  require("./"+dependencies[i]);
require("./release");

// default task
gulp.task("default", dependencies, function () {
  // just runs other tasks
});

// watches the files for changes and starts the appropriate task 
gulp.task("watch", ["default"], function () {
  gulp.watch("src/**/*.js", ["scripts"]);
  gulp.watch("src/**/*.css", ["styles"]);
  gulp.watch("src/html/*.html", ["html"]);
  gulp.watch("src/img/*", ["images"]);
  gulp.watch("src/ts/**/*.ts", ["typescript"]);
  gulp.watch("src/sass/**/*.scss", ["sass"]);
});