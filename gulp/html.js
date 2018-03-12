var gulp=require("gulp");
var file=require("gulp-file");
var linq=require("linq");

// builds all html templates
function run($) {
  return buildMain($)
}

// builds the specified template
function buildMain($)
{
  // get pages
  var pages=$.getPages();
  var resources=["common", "main"].concat(pages);

  // build index.html
  var stream=$.buildTpl(resources, "%srchtml/index.html", "%dst", function (cfg) { return extendCfg($, cfg); });

  // build pages
  linq.from($.getPages()).forEach(function (page)
  {
    stream.add($.buildTpl(resources, "%srchtml/pages/"+page+".html", "%dst/pages", function (cfg) { return extendCfg($, cfg); }));
  });

  // create cname file
  stream.add(file("CNAME", $.cfg.cname, { src: true })
    .pipe(gulp.dest($.cfg.dest))); 

  return stream;
}

function extendCfg($, cfg)
{
  // set lang url
  var res=cfg.res;
  res.lng.chgurl=$.cfg.lngurl;

  // add dummy events
  res.upcoming.list=new Array($.cfg.shownEvents);

  // add app config
  cfg.appcfg=JSON.stringify({
    root: cfg.root,
    lang: cfg.lang,
    shownEvents: cfg.shownEvents,
    preloadPages: cfg.preloadPages,
    ctx: cfg.ctx,
    res: res.client,
    pages: ["main"].concat($.getPages()),
  });
}

module.exports={
  run: run
};