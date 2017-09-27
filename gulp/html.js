var gulp=require("gulp");
var changed=require("gulp-changed");
var tpldata=require("gulp-data");
var render=require("gulp-nunjucks-render");
var rename=require("gulp-rename");
var each=require("gulp-each");
var file=require("gulp-file");
var fs=require("fs");
var deepAssign=require("deep-assign");
var linq=require("linq");
var mstream=require("merge-stream");

// builds all html templates
function run($) {
  return buildMain($)
}

// builds the specified template
function buildMain($)
{
  // get resource
  var res=$.cfg.res=$.merge("%srcres/tpl/"+$.cfg.lang+".json", "%srcres/main/"+$.cfg.lang+".json");

  // set lang url
  res.lng.chgurl=$.cfg.lngurl;

  // add events
  res.events.list=$.getEventList(res)||[];
  if (!linq.from(res.events.list).any(function (e) { return e.price.indexOf("(*)")>-1; }))
    res.events.youthDiscountInfo=null;
  if (!linq.from(res.events.list).any(function (e) { return e.price.indexOf("(**)")>-1; }))
    res.events.erlebnisCardInfo=null;

  // parse resource
  res=$.parseResource(res);

  return $.src("%srchtml/index.html")
    .pipe(tpldata(function() { 
      return $.cfg;
    }))
    .pipe(render({ path: [$.cfg.src] }))
    .pipe(file("CNAME", $.cfg.cname)) // add cname
    .dest("%dst");
}

module.exports={
  run: run
};