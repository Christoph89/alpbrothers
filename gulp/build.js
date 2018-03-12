
var gulp=require("gulp");
var del=require("del");
var fs=require("fs");
var linq=require("linq");
var mstream=require("merge-stream");
var deepAssign=require("deep-assign");
var parts=["scripts", "styles", "html", "blog", "tpl", "images", "typescript", "sass", "forms"];

// read config file
var configs=JSON.parse(fs.readFileSync("./gulpcfg.json"));
function getCfg(name) { return deepAssign({}, configs["common"], configs[name]); }
function getUtil(cfg) { return require("./util").run((typeof cfg == "string")?getCfg(cfg):cfg); }

// builds all definitions
function build(name)
{
  var stream=new mstream();
  var cfg=configs[name];
  linq.from(cfg.build).forEach(function (bcfg)
  {
    cfg=deepAssign(getCfg(name), bcfg);
    if (cfg.verbose) console.log("build "+JSON.stringify(cfg));
    stream.add(buildParts(getUtil(cfg)));
  });
  return stream;
}

// builds all specified parts
function buildParts($) {
  var stream=new mstream();
  linq.from(parts).forEach(function (p)
  {
    if (!$.cfg.parts || $.cfg.parts.indexOf(p)>-1)
    {
      if ($.cfg.verbose) console.log("build "+p);
      var mod=require("./"+p).run($);
      if (mod) stream.add(mod);
    }
  });
  return stream;
}

// build task
gulp.task("build", function () {
  return build("dbg");
});

// release task
gulp.task("release", ["build"], function () {
  return build("release");
});

// cleans the project
gulp.task("clean", function () {
  var dest=[];
  linq.from(configs).forEach(function (p) {
    linq.from(p.value.build||[]).forEach(function (b) {
      dest.push(b.dest);
    });
  });
  console.log("clean "+JSON.stringify(dest, null, "  "));
  return del(dest, { force: true });
});