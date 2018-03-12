var uglifycss=require("gulp-uglifycss");

// copies all css files and fonts
function run($) {
  var stream=$.src("%srcsass/font.css");
  if ($.cfg.min) stream=stream.pipe(uglifycss({}));
  stream.dest("%dstcss");

  return $.copy(["%srcfonts/*"], "%dstfonts")
    .add(stream);
}

module.exports={
  run: run
}