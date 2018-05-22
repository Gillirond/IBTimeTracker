import {Injectable} from '@angular/core';
import {Task} from './task';
import {TimerService} from './timer.service';
import {HttpService} from './http.service';

@Injectable()
export class TaskService{
  activeTaskStartTime: Date;

  private data: Task[] = [
    {name: "Working on creating time tracking application", project: "timer", startTime: new Date("2018-05-18T14:00:00"), endTime: new Date("2018-05-18T16:00:00")},
    {name: "Setup the basic angular with task runners", project: "timer", startTime: new Date("2018-05-18T16:10:00"), endTime: new Date("2018-05-18T18:00:00")},
    {name: "Creating backend php scripts", project: "backend", startTime: new Date("2018-05-19T11:00:00"), endTime: new Date("2018-05-19T13:25:10")}
  ];

  private tasksByDay=[];

  constructor(private timerService: TimerService, private httpService: HttpService) {}

  sortTasks() {
    this.data = this.data.sort(function(a,b) {
      return (b.endTime.getTime() - a.endTime.getTime());
    });
  }

  divideByDay() {
    this.sortTasks();
    this.tasksByDay = [];
    this.data.forEach(function(value) {
      let endDate=value.endTime.getDate()+"."+value.endTime.getMonth()+"."+value.endTime.getFullYear();

      let found: boolean = false;
      this.tasksByDay.forEach(function(obj) {
        if(obj.hasOwnProperty("day"))
          if(obj.day == endDate) {
            found = true;
            obj.dayTasks.push(value);
          }
      });
      if(!found )
        this.tasksByDay.push({"day": endDate,
          "dayTasks": [value]});

    }.bind(this));
  }

  getTasksByDay() {
    this.divideByDay();
    return this.tasksByDay;
  }

  startTask(name: string, project: string){
    this.activeTaskStartTime = new Date();
    this.timerService.startTimer(this.activeTaskStartTime);
    //http://localhost/IB%20Time%20Tracker/php/addActiveTask.php
    this.httpService.postData('http://localhost/IB Time Tracker/php/addActiveTask.php', {"name": name, "project": project, "starttime": this.activeTaskStartTime});
  }

  stopTask(name: string, project: string) {
    this.timerService.endTimer();
    let now = new Date();
    this.data.push(new Task(name, project, this.activeTaskStartTime, now));
    //http://localhost/IB%20Time%20Tracker/php/stopActiveTask.php
    this.httpService.postData('http://localhost/IB Time Tracker/php/stopActiveTask.php', JSON.stringify({"endtime": now}));
    this.divideByDay();
  }

  getTasks() {
    //getting active task from DB if possible and full tasklist
      let answer = {};
      this.httpService.getData('http://localhost/IB Time Tracker/php/getTasks.php', function(dbtasks) {
      answer["isactive"] = false;
      if(dbtasks.hasOwnProperty("active")) {
        answer["isactive"] = true;
        answer["activeTask"] = dbtasks.active;
        let temp = new Date(dbtasks.active.startTime);
        answer["activeTask"].startTime = temp;
      }
      if(dbtasks.hasOwnProperty("tasklist")) {
        this.data.length = 0;
        dbtasks["tasklist"].forEach(function(value) {
          let temp1 = new Date(value.startTime);
          let temp2 = new Date(value.endTime);
          this.data.push(new Task(value.name, value.project, temp1, temp2));
        }.bind(this));
      }
    }.bind(this));
      return answer;
  }
}
