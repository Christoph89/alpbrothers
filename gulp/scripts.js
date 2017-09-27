// copies all js files
function run($) 
{
  return $.copy([
    "%srcvendor/jquery/*.js",
    "%srcvendor/modernizr/modernizr.js",
    "%srcvendor/skel/skel.js",
    "%srcvendor/linq/linq.js",
  ], "%dstjs");
}

module.exports={
  run: run
};
