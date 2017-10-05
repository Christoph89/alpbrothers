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
  // build index.html
  var stream=$.buildTpl("%srchtml/index.html", "%dst", function (res)
  {
    // set lang url
    res.lng.chgurl=$.cfg.lngurl;

    // add events
    res.events.list=$.getEventList(res)||[];
    if (!linq.from(res.events.list).any(function (e) { return e.price.indexOf("(*)")>-1; }))
      res.events.youthDiscountInfo=null;
    if (!linq.from(res.events.list).any(function (e) { return e.price.indexOf("(**)")>-1; }))
      res.events.erlebnisCardInfo=null;
  });

  // create cname file
  stream.add(file("CNAME", $.cfg.cname, { src: true })
    .pipe(gulp.dest($.cfg.dest))); 

  return stream;
}

module.exports={
  run: run
};