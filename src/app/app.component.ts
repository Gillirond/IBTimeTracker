import { Component, OnInit } from '@angular/core';
import { Task } from './task';
import { TaskService} from './task.service';
import { TimerService} from './timer.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `<div class="page-header">
                <h1 class="text-center">{{title}}</h1>
             </div>
             <div class="top-buffer"></div>
             <div class="panel">
                <div class="form-inline col-sm-12 col-md-12 col-lg-12">
                   <div class="form-group">
                      <div class="col-sm-8 col-md-8 col-lg-8">
                         <input class="form-control" [(ngModel)]="name" required placeholder="What are you working on?"/>
                      </div>
                   </div>
                   <div class="form-group">
                      <div class="col-sm-6 col-md-6 col-lg-6">
                         <select class="form-control" [(ngModel)]="project" required size="1">
                            <option disabled selected>select project</option>
                            <option *ngFor="let projectname of projectList">{{projectname}}</option>
                         </select>
                      </div>
                   </div>
                   <div class="form-group">
                      <div class="col-sm-6 col-md-6 col-lg-6">
                         <input disabled class="form-control" [(ngModel)]="timePeriod.str"/>
                      </div>
                   </div>
                   <div class="form-group">
                      <div class="col-sm-offset-2 col-sm-6 col-md-offset-2 col-md-6 col-lg-offset-2 col-lg-6">
                         <button *ngIf="!activeTask" class="btn btn-success" (click)="startTask(name, project)">Start</button>
                         <button *ngIf="activeTask" class="btn btn-danger" (click)="endTask(name, project)">Stop</button>
                      </div>
                   </div>
                </div>
                <div class="top-buffer"></div>
             <table class="table">
                <tbody *ngFor="let day of tasksByDay">
                <h3 *ngIf="!ifDateIsNow(day.day)">{{day.dayTasks[0].endTime | date:"E, d MMM"}}</h3>
                <h3 *ngIf="ifDateIsNow(day.day)">Today</h3>
                <tr *ngFor="let task of day.dayTasks">
                   <td>{{task.name}}</td>
                   <td>{{task.project}}</td>
                   <td>{{task.endTime - task.startTime - (3599*2*1000) | date:"HH:mm:ss"}}</td>
                   <td>{{task.startTime | date:"d-MMM-yyyy HH:mm"}} - {{task.endTime | date:"d-MMM-yyyy HH:mm"}}</td>
                </tr>
                </tbody>
             </table>
             </div>
         
   `,
  styleUrls: ['./app.component.css'],
  providers: [TaskService, TimerService]
})
export class AppComponent implements OnInit {
  name: string;
  project: string;
  timePeriod;
  activeTask: boolean = false;
  title = 'IB Time Tracker';

  projectList: string[];
  tasksByDay = [];

  constructor(private taskService: TaskService, private timerService: TimerService, private http:HttpClient) {
    this.http.get('../assets/projectList.json').subscribe((data:string[]) => this.projectList = data);
  }

  startTask(name: string, project: string) {
    if(name==null||name.trim()=="")
      return;
    this.activeTask = true;
    this.taskService.startTask(name, project);
  }

  endTask(name: string, project: string) {
    this.activeTask = false;
    this.taskService.stopTask(name, project);

    this.tasksByDay = this.taskService.getTasksByDay( );
  }

  ngOnInit(){
    this.tasksByDay = this.taskService.getTasksByDay( );
    this.timePeriod = this.timerService.getTimer();

    let checkActive: any;
    checkActive = this.taskService.checkActive();
    if(checkActive === false)
      this.activeTask = false;
    else {
      this.activeTask = true;
      this.name = checkActive.name;
      this.project = checkActive.project;
      this.taskService.activeTaskStartTime = checkActive.startTime;
    }
  }

  ifDateIsNow(day: string) {
    let today = new Date();
    let todayStr:string = today.getDate()+'.'+today.getMonth()+'.'+today.getFullYear();
    return(todayStr==day?true:false);
  }
}
