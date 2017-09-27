// copies all forms
function run($) {
  return $.copy([
    "%srcforms/*.pdf",
    "%srcforms/2017/*.pdf",
  ], "%dstforms");
}

module.exports={
  run: run
};