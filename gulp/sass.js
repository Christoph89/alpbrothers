var sass=require("gulp-sass");
var uglifycss=require("gulp-uglifycss");

// compiles the application's sass/scss files
function run($) {
  // compile scss
  var stream=$.src("%srcsass/main.scss")
    .pipe(sass().on("error", sass.logError));

  // minify
  if ($.cfg.min) 
    stream=stream.pipe(uglifycss({}));

  // set dest
  return stream.dest("%dstcss");
}

module.exports={
  run: run
};
