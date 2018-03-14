var concat=require("gulp-concat");
var uglify=require("gulp-uglify");

// copies all js files
function run($) 
{
  // concat external js
  var stream=$.src([
    "%srcvendor/jquery/*.js",
    "%srcvendor/modernizr/modernizr.js",
    "%srcvendor/skel/skel.js",
    "%srcvendor/linq/linq.js",
    "%srcvendor/moment/moment.js",
    "%srcvendor/js-cookie/js-cookie.js",
  ])
  .pipe(concat("vendor.js"));

  // minify 
  if ($.cfg.min)
    stream=stream.pipe(uglify({}));

  // set dest
  return stream.dest("%dstjs");
}

module.exports={
  run: run
};
