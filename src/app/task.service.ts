import {Injectable} from '@angular/core';
import {Task} from './task';
import {TimerService} from './timer.service';

@Injectable()
export class TaskService{
  activeTaskStartTime: Date;

  private data: Task[] = [
    {name: "Working on creating time tracking application", project: "timer", startTime: new Date("2018-05-18T14:00:00"), endTime: new Date("2018-05-18T16:00:00")},
    {name: "Setup the basic angular with task runners", project: "timer", startTime: new Date("2018-05-18T16:10:00"), endTime: new Date("2018-05-18T18:00:00")},
    {name: "Setup the basic angular with task runners", project: "bootstrap", startTime: new Date("2018-05-19T11:00:00"), endTime: new Date("2018-05-18T13:25:10")}
  ];

  private tasksByDay=[];

  constructor(private timerService: TimerService) {}

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
  }

  stopTask(name: string, project: string) {
    this.timerService.endTimer();
    this.data.push(new Task(name, project, this.activeTaskStartTime, new Date()));
    this.divideByDay();
  }

  checkActive() {
    //обращение в бд и получение активной таски
    return false;
  }
}
