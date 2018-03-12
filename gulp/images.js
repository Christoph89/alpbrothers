// copies all images
function run($) {
  return $.copy(["%srcimg/*.png", "%srcimg/*.jpg", "%srcimg/*.gif", "%srcimg/*.svg"], "%dstimg")
    .add($.copy(["%srcimg/gallery/**/*"], "%dstimg/gallery"))
    .add($.copy(["%srcimg/events/*"], "%dstimg/events"))
    .add($.copy(["%srcimg/partner/*"], "%dstimg/partner"));
}

module.exports={
  run: run
};