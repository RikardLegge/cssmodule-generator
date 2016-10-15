/**
 * Custom time implementation
 */
export default class Timer {
  constructor() {
    this.timers = {};
  }

  getTimers(){
    return this.timers;
  }

  getTimerList(){
    var timerList = Object.keys(this.timers).map((name)=> {return {name, time: this.timers[name]}});

    timerList.sort((a, b)=>a.time - b.time);

    return timerList;
  }

  getRelativeTimers() {
    var prevTime = this.timers.start;

    return this.getTimerList().reduce((diff, timer)=> {
      var delta = timer.time - prevTime - 1;

      delta = delta < 0 ? 0 : delta;
      diff[timer.name] = delta;
      prevTime = timer.time;

      return diff;
    }, {});
  }

  getDuration() {
    var timerList = this.getTimerList();
    return timerList[timerList.length - 1].time - timerList[0].time
  }
}