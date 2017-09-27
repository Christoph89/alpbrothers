var ts=require("gulp-typescript");
var uglify=require("gulp-uglify");

// compiles the application's typescript files
function run($) {
  // compile ts
  var stream=$.src("%srcts/app.ts")
    .pipe(ts({
      noImplicitAny: false,
      out: "app.js"
    }));

  // minify 
  if ($.cfg.min)
    stream=$.pipe(stream.js, uglify({}));  

  // set dest
  return stream.dest("%dstjs");
}

module.exports={
  run: run
};