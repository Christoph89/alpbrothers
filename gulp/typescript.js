var gulp=require("gulp");
var ts=require("gulp-typescript");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;

// compiles the application's typescript files
gulp.task("typescript", function () {
  // compile app.ts
  //return gulp.src(src+"ts/app.ts")
  //  .pipe(ts({
  //      noImplicitAny: true,
  //      out: "app.js"
  //  }))
  //  .pipe(gulp.dest(dbg+"js"));
});
