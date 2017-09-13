var gulp=require("gulp");
var changed=require("gulp-changed");
var uglify=require("gulp-uglify");
var uglifycss=require("gulp-uglifycss");

// get process environment vars
var dbg=process.env.DBG;
var release=process.env.RLS;

// minify htd folder / create ht folder
gulp.task("release", ["build"], function () {
  // minify js
  gulp.src(dbg+"js/*.js")
    .pipe(changed(release+"js"))
    .pipe(uglify({}))
    .pipe(gulp.dest(release+"js"));

  // minify css
  gulp.src(dbg+"css/*.css")
    .pipe(changed(release+"css"))
    .pipe(uglifycss({}))
    .pipe(gulp.dest(release+"css"));

  // copy fonts
  gulp.src(dbg+"fonts/*")
    .pipe(changed(release+"fonts"))
    .pipe(gulp.dest(release+"fonts"));

  // copy html, favicon and tpl files from root folder
  gulp.src(dbg+"*")
    .pipe(changed(release))
    .pipe(gulp.dest(release));

  // copy english html
  gulp.src(dbg+"en/*")
    .pipe(changed(release+"en"))
    .pipe(gulp.dest(release+"en"));
    
  // copy blog html
  gulp.src(dbg+"blog/*")
    .pipe(changed(release+"blog"))
    .pipe(gulp.dest(release+"blog"));

  // copy images
  gulp.src(dbg+"img/**/*")
    .pipe(changed(release+"img"))
    .pipe(gulp.dest(release+"img"));

 // copy forms
  gulp.src(dbg+"forms/**/*")
    .pipe(changed(release+"forms"))
    .pipe(gulp.dest(release+"forms"));
});