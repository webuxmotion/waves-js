var Animate = function (win) {
  this.requestAnimationFrame = (function (w) {
    return w.requestAnimationFrame ||
      w.webkitRequestAnimationFrame ||
      w.mozRequestAnimationFrame ||
      w.oRequestAnimationFrame ||
      w.msRequestAnimationFrame ||
      function (callback) {
        w.setTimeout(callback, 1000 / 60);
      };
  })(win);

  this.animations = [];
  this.animationsStatus = {};

  this.requestAnimationFrame.call(this.win, this.update.bind(this));
};

let starts = 0;
let ends = 0;

Animate.prototype.update = function (time) {
  this.requestAnimationFrame.call(this.win, this.update.bind(this));
  this.time = time;

  this.animations.forEach((item, index) => {
    let startTime = this.animationsStatus[index] && this.animationsStatus[index].startTime || null;
    let endTime = this.animationsStatus[index] && this.animationsStatus[index].endTime || null;

    if (endTime === null) {
      if (startTime === null) {
        if (this.time > item.delay) {
          startTime = this.time;
        }
      } else {
        var timeFraction = (this.time - startTime) / item.duration;

        if (!item.reply) {
          if (timeFraction > 1) {
            timeFraction = 1;
            endTime = this.time;
          };
        }
  
        var progress = item.timing(timeFraction);
        item.draw(progress);
      }
  
      this.animationsStatus[index] = {
        ...this.animationsStatus[index],
        startTime,
        endTime,
      };
    }
  });
};

Animate.prototype.logTime = function () {
  console.log(this.time);
};

Animate.prototype.animate = function (options) {
  this.animations.push(options);
};