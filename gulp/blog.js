var gulp=require("gulp");
var fs=require("fs");
var file=require("gulp-file");
var linq=require("linq");
var each=require("gulp-each");
var mstream=require("merge-stream");

// builds all blog entries
function run($) {
  return null;
}

function buildStories($) {
  var stream=new mstream();
  var stories=[];
  $.src("%srchtml/blog/**/story.json").pipe(each(function(content, file, clb) {
    var story=JSON.parse(content);
    var storyStream=createStory($, story, file.history[0].replace("story.json", ""));
    if (storyStream) 
    {
      stream.add(storyStream);
      stories.push(story);
    }
  }));
  return {
    stream: stream,
    stories: stories
  };
}

// creates all stories
// gulp.task("blog-stories", function () {
//   return gulp.src([
//     src+"html/blog/**/story.json"
//   ])
//   .pipe(each(function (content, file, clb)
//   {
//     var story=JSON.parse(content);
//     var dir=file.history[0].replace("story.json", "");
//     if (story)
//     {
//       createStory("de", story, dir);
//       createStory("en", story, dir);
//     }
//     return clb(null, content);
//   }));
// });

// creates a story from the specified language and content
function createStory($, story, dir)
{
  try
  {
    if (story) stories.push(story); // add story to list
    var res=story&&story.res?story.res[lang]:null;
    if (!lang || !res || res.disabled)
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

// function createIndex(lang, stories)
// {
//   if (!lang || !stories || !stories.length)
//     return;

//   // get resource
//   var defaultRes=JSON.parse(fs.readFileSync(src+"res/tpl/"+lang+".json"));
//   var res=deepAssign(defaultRes, JSON.parse(fs.readFileSync(src+"res/blog/"+lang+".json")));

//   // get destination
//   var lng=lang!=deflng?(lang+"/"):"";
//   var dest=dbg+lng+"blog"; 

//   // get relevant stories
//   Enumerable.from(stories).where(function (x) { return x && x.res && x.res[lang] && !x.res[lang].disabled; }).toArray();

//   // create html
//   gulp.src(src+"html/blog/blog.html")
//   .pipe(tpldata(function(){ 
//     return { 
//       root: lang==deflng?"../":"../../", 
//       lang: lang,
//       res: res
//     };
//   }))
//   .pipe(render({ path: [src] }))
//   .pipe(rename("index.html"))
//   .pipe(gulp.dest(dest));
// }

module.exports={
  run: run
};