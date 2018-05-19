import {Injectable} from '@angular/core';
import {Task} from './task';

@Injectable()
export class TaskService{
  activeTaskStartTime: Date;

  private data: Task[] = [
    {name: "Working on creating time tracking application", project: "timer", startTime: new Date("2018-05-18T14:00:00"), endTime: new Date("2018-05-18T16:00:00")},
    {name: "Setup the basic angular with task runners", project: "timer", startTime: new Date("2018-05-18T16:10:00"), endTime: new Date("2018-05-18T18:00:00")}


  ];

  sortTasks() {
    this.data = this.data.sort(function(a,b) {
      return (a.endTime.getTime() - b.endTime.getTime());
    });
  }

  getTasks(): Task[] {
    this.sortTasks();
    return this.data;
  }
  startTask(name: string, project: string){
    this.activeTaskStartTime = new Date();
  }
  stopTask(name: string, project: string) {
    this.data.push(new Task(name, project, this.activeTaskStartTime, new Date()));
  }
  checkActive() {
    //обращение в бд и получение активной таски
    return false;
  }
}
