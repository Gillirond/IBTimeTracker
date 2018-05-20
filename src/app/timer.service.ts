import {Injectable} from '@angular/core';

@Injectable()
export class TimerService{
  private intervalId;
  private timerStr = {str: "0 sec"};

  transformTimeToStr(time: number) {
    let timeStr: string = "";

    let dms: number = 3600*24*1000;
    let hms: number = 3600*1000;
    let mms: number = 60*1000;
    let sms: number = 1000;

    let d: number = (time - time%dms)/dms;
    let h: number = (time - time%hms)/hms - 24*d;
    let m: number = (time - time%mms)/mms - 60*h;
    let s: number = (time - time%sms)/sms - 60*m;

    if(d>0)
      timeStr+=d + " d ";
    if(h>0)
      timeStr+=h + " h ";
    if(m>0)
      timeStr+=m + " min ";
    timeStr+=s + " sec";

    return timeStr;
  }

  startTimer(startTime: Date) {
    this.intervalId = setInterval(function(){
      let period = Date.now() - startTime.getTime();
      this.timerStr.str = this.transformTimeToStr(period);
    }.bind(this), 1000);
  }

  endTimer() {
    clearInterval(this.intervalId);
    this.timerStr.str = "0 sec";
  }

  getTimer() {
    return this.timerStr;
  }
}
