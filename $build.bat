@echo off
pushd %~dp0

rem copag
if not "%2"=="-noget" (
  call npm install || exit /b 1
)

rem gulp build
set task=%1
if "%task%"=="" (
  set task="release"
)
SET NODE_PATH=%~dp0node_modules
call node %~dp0node_modules\gulp\bin\gulp.js %task% --gulpfile %~dp0gulp\default.js --cwd %~dp0 || exit /b 1