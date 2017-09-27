// copies all css files and fonts
function run($) {
  return $.copy(["%srcsass/font.css"], "%dstcss")
    .add($.copy(["%srcfonts/*"], "%dstfonts"));
}

module.exports={
  run: run
}