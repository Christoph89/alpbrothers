var requireDir=require('require-dir');

// set process environment vars
process.env.SRC="src/"; // set source folder
process.env.DBG="docs_debug/"; // set debug output folder
process.env.RLS="docs/"; // set release output folder

// require gulp files
requireDir("./gulp");