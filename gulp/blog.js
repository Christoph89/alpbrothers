var gulp=require("gulp");
var each=require("gulp-each");
var changed=require("gulp-changed");
var tpldata=require("gulp-data");
var rename=require("gulp-rename");
var njucks=require("gulp-nunjucks");
var render=require("gulp-nunjucks-render");
var fs=require("fs");
var deepAssign=require("deep-assign");

// get process environment vars
var src=process.env.SRC;
var dbg=process.env.DBG;
var deflng=process.env.DEFLNG;

var stories=[];

// copies all html files to htd
gulp.task("blog", ["blog-stories"], function () {

  // create blog page
  createIndex("de", stories);
  createIndex("en", stories);

  // // write story index file
  // for (var lang in stories)
  // {
  //   createIndex(lang, stories);
  //   //var lngPath=dbg+(lang!=deflng?(lang+"/"):"");
  //   //if (!fs.existsSync(lngPath)) fs.mkdirSync(lngPath);
  //   //if (!fs.existsSync(lngPath+"blog")) fs.mkdirSync(lngPath+"blog");
  //   //fs.writeFileSync(lngPath+"blog/index.json", JSON.stringify(storyIndex[lang], null, "  ")); 
  // }
});

// creates all stories
gulp.task("blog-stories", function () {
  return gulp.src([
    src+"html/blog/**/story.json"
  ])
  .pipe(each(function (content, file, clb)
  {
    var story=JSON.parse(content);
    var dir=file.history[0].replace("story.json", "");
    if (story)
    {
      createStory("de", story, dir);
      createStory("en", story, dir);
    }
    return clb(null, content);
  }));
});

// creates a story from the specified language and content
function createStory(lang, story, dir)
{
  try
  {
    if (story) stories.push(story); // add story to list
    var res=story&&story.res?story.res[lang]:null;
    if (!lang || !res || res.disable)
      return;

    // check html file
    var htmlFile=dir+"story.html";
    if (!fs.existsSync(htmlFile))
      return;

    // extend resource
    var defaultRes=JSON.parse(fs.readFileSync(src+"res/tpl/"+lang+".json"));
    res=deepAssign(defaultRes, res);

    // get destination
    var storyUrl=res.story?res.story.url:null;
    if (!storyUrl)
      throw "Missing story url ("+lang+") for '"+dir+"'! "+JSON.stringify(story);
    var lng=lang!=deflng?(lang+"/"):"";
    var dest=dbg+lng+"blog/"+storyUrl; 
      
    // create html story from tpl
    gulp.src(htmlFile)
      .pipe(tpldata(function(){ 
        return { 
          root: lang==deflng?"../../":"../../../", 
          lang: lang,
          res: res
        };
      }))
      .pipe(render({ path: [src] }))
      .pipe(rename("index.html"))
      .pipe(gulp.dest(dest));
  }
  catch (ex)
  {
    console.log("Could not create story ("+lang+") for '"+dir+"'! "+JSON.stringify(story));
    throw ex;
  }
}

function createIndex(lang, stories)
{
  if (!lang || !stories || !stories.length)
    return;

  // get resource
  var defaultRes=JSON.parse(fs.readFileSync(src+"res/tpl/"+lang+".json"));
  var res=deepAssign(defaultRes, JSON.parse(fs.readFileSync(src+"res/blog/"+lang+".json")));

  // get destination
  var lng=lang!=deflng?(lang+"/"):"";
  var dest=dbg+lng+"blog"; 

  // create html
  gulp.src(src+"html/blog/blog.html")
  .pipe(tpldata(function(){ 
    return { 
      root: lang==deflng?"../":"../../", 
      lang: lang,
      res: res
    };
  }))
  .pipe(render({ path: [src] }))
  .pipe(rename("index.html"))
  .pipe(gulp.dest(dest));
}