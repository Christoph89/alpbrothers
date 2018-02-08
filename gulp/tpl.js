// copies all tpl files
function run($) {
  return $.copy([
    "%srcimg/favicon/*",
    "%srctpl/CNAME",
    "%srctpl/browserconfig.xml",
    "%srctpl/sitemap.xml",
    "%srctpl/humans.txt",
    "%srctpl/robots.txt",
    "%srctpl/google5e333bbe565a5f1b.html",
    "%srctpl/google822ef9d665cb404e.html",
  ], "%dst");
}

module.exports={
  run: run
};