var gulp=require("gulp");
var changed=require("gulp-changed");
var tpldata=require("gulp-data");
var render=require("gulp-nunjucks-render");
var rename=require("gulp-rename");
var each=require("gulp-each");
var fs=require("fs");
var deepAssign=require("deep-assign");
var dateFormat=require("dateformat");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;
var deflng=process.env.DEFLNG;

// builds all html templates
gulp.task("html", function () {
  return gulp.src(src+"res/main/*.json")
    .pipe(each(function (content, file, clb)
    {
      res=JSON.parse(content);
      var lang=file.history[0].replace(/^.*[\\\/]/, '').substr(0, 2);
      return clb(null, buildMain(lang, res, dbg));
    }));
});

// builds the specified template
function buildMain(lang, res, dest)
{
  // extend resource
  var tplres=JSON.parse(fs.readFileSync(src+"res/tpl/"+lang+".json"));
  res=deepAssign(tplres, res);

  // add events
  res.events.list=getEventList(res);

  if (lang!=deflng)
    dest+="/"+lang;

  return gulp.src(src+"html/index.html")
    .pipe(tpldata(function(){ 
      return { 
        root: lang==deflng?"":"../", 
        lang: lang,
        res: res
      };
    }))
    .pipe(render({ path: [src] }))
    .pipe(gulp.dest(dest));
}

function getEventList(res)
{
  var events=JSON.parse(fs.readFileSync(src+"res/events.json"));
  var list=[];

  for (var i=0; i<events.length; i++)
  {
    var ev=events[i];
    list.push({
      date: getEventDate(ev, res),
      name: ev.name,
      price: ev.price,
      url: ev.url    
    });
  }

  return list;
}

function getEventDate(ev, res)
{
  var from=new Date(Date.parse(ev.from));
  var to=ev.to?new Date(Date.parse(ev.to)):null;
  if (!to)
    return dateFormat(from, res.dateFormat);
  var parts=res.fromToFormat.split(" - ");
  return dateFormat(from, parts[0])+" - "+dateFormat(to, parts[1]);
}