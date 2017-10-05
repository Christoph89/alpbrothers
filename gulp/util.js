var gulp=require("gulp");
var mstream=require("merge-stream");
var multiDest=require("gulp-multi-dest");
var dateFormat=require("dateformat");
var deepAssign=require("deep-assign");
var rename=require("gulp-rename");
var tpldata=require("gulp-data");
var render=require("gulp-nunjucks-render");
var pathutil=require("path");
var linq=require("linq");
var fs=require("fs");


function run(cfg) {
  var _replace={ "%src": cfg.src, "%dst": cfg.dest, "%lng": cfg.lang };

  function getPath(path, forceArray)
  {
    var res;
    if (typeof path == "string")
      res=linq.from(_replace).selectMany(function (p) { return combineAll(path, p.key, p.value); }).distinct().toArray();
    else
      res=linq.from(path).selectMany(function (p) { return getPath(p, true); }).distinct().toArray();

    if (typeof res == "string")
      return forceArray?[res]:res; // single path string
    else if (res.length==1 && !forceArray)
      return res[0]; // first array entry
    return res; // array
  }

  function combineAll(str, key, vals)
  {
    if (str.indexOf(key)<0)
      return [];
    str=Array.isArray(str)?str:[str];
    vals=Array.isArray(vals)?vals:[vals];
    return linq.from(str).selectMany(function(s){
      return linq.from(vals).select(function (v) {
        return s.replace(key, v);
      }).toArray();
    }).distinct().toArray();
  }

  function extendStream(stream)
  {
    if (!stream.dest) stream.dest=dest;
    if (!stream.basePipe) 
    {
      stream.basePipe=stream.pipe;
      stream.pipe=pipe;
    }
    return stream;
  }

  function pipe()
  {
    var stream=extendStream(this);
    var args=linq.from(arguments).select(x => x).toArray();
    var output=stream.basePipe.apply(stream, args); 
    return extendStream(output);
  }

  function src(path)
  {
    path=getPath(path);
    if (cfg.verbose) console.log("src "+JSON.stringify(path));
    return extendStream(gulp.src(path));
  }

  function dest(path)
  {
    path=getPath(path);
    if (cfg.verbose) console.log("dest "+JSON.stringify(path));
    var stream=this&&this.pipe?this:null;
    if (typeof path == "string")
    {
      var filename=pathutil.extname(path)?pathutil.basename(path):null;
      if (filename && stream)
        return stream.pipe(rename(filename)).pipe(gulp.dest(pathutil.dirname(path)));
      else if (stream)
        return stream.pipe(gulp.dest(path));
      return gulp.dest(path);
    }
    else
    {
      var filename;
      var paths=linq.from(path).select(function (p)
      {
        if (!pathutil.extname(p))
          return p;
        filename=pathutil.basename(p);
        return pathutil.dirname(p);
      }).toArray();

      if (filename && stream)
        return this.pipe(rename(filename)).pipe(multiDest(paths));
      else if (stream)
        return this.pipe(multiDest(paths));
      return pipe(multiDest(paths));
    }
  }

  function copy(source, destination)
  {
    if (cfg.verbose) console.log("copy "+JSON.stringify(source)+" -> "+JSON.stringify(destination));
    return new mstream(src(source).dest(destination));
  }

  function getEventList(res, includeExpired, file)
  {
    if (!file) file=cfg.events;
    var events=JSON.parse(fs.readFileSync(file)) || [];

    var all=linq.from(events).select(function(ev) { 
      return {
        date: parseEventDate(ev, res),
        name: ev.name,
        price: ev.price,
        url: ev.url    
      };
    });
    
    if (!includeExpired)
    {
      var now=new Date();
      all=all.where(function (ev) { return (ev.date.to||ev.date.from)>now; });
    }

    return all.toArray();
  }

  // parses the specified date
  function parseEventDate(ev, res)
  {
    var date={
      from: new Date(Date.parse(ev.from)),
      to: ev.to?new Date(Date.parse(ev.to)):null
    };
    if (!date.to)
      date.txt=dateFormat(date.from, res.dateFormat);
    else
    {
      var parts=res.fromToFormat.split(" - ");
      date.txt=dateFormat(date.from, parts[0])+" - "+dateFormat(date.to, parts[1]);
    }
    date.iso=(date.to||date.from).toISOString();
    return date;
  }

  // merge the specified json and/or files
  function merge()
  {
    return deepAssign.apply(this, linq.from(arguments).select(function (x) { 
      if (typeof x == "string")
        return JSON.parse(fs.readFileSync(getPath(x))); // read json file
      return x;
    }).toArray());
  }

  function parseResource(res)
  {
    if (Array.isArray(res))
      return linq.from(res).select(function (x) { return parseResource(x); }).toArray();
    else if (typeof res == "object")
    {
      for (var key in res)
        res[key]=parseResource(res[key]);
    }
    else if (typeof res == "string" && res[0]=="%")
    {
      var path=res.substr(1).split(".");
      var val=cfg;
      for (var i=0; i<path.length; i++)
      {
        val=val[path[i]];
        if (val===undefined)
          throw "Unknown path '"+res+"'!";
      }
      return val;
    }
    return res;
  }

  // builds the specified template
  function buildTpl(tpl, destination, extendRes)
  {
    // get resource
    var res=cfg.res=merge("%srcres/tpl/"+cfg.lang+".json", "%srcres/main/"+cfg.lang+".json");
  
    // extend resource
    if (extendRes)
      extendRes(res);
  
    // parse resource
    res=parseResource(res);
  
    return new mstream(src(tpl)
      .pipe(tpldata(function() { 
        return cfg;
      }))
      .pipe(render({ path: [cfg.src] }))
      .dest(destination));
  }

  return {
    cfg: cfg,
    getPath: getPath,
    src: src,
    dest: dest,
    copy: copy,
    pipe: function () { return pipe.apply(arguments[0], linq.from(arguments).skip(1).toArray()); },
    getEventList: getEventList,
    buildTpl: buildTpl,
    merge: merge,
    parseResource: parseResource
  }; 
}

module.exports={
  run: run
};