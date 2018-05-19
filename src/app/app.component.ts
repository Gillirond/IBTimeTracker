import { Component, OnInit } from '@angular/core';
import { Task } from './task';
import { TaskService} from './task.service';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  template: `<div class="page-header">
                <h1>{{title}}</h1>
             </div>
             <div class="panel">
                <div class="form-inline">
                   <div class="form-group">
                      <div class="col-md-8">
                         <input class="form-control" [(ngModel)]="name" placeholder="What are you working on?"/>
                      </div>
                   </div>
                </div>
                <div class="form-inline">
                   <div class="form-group">
                      <div class="col-md-6">
                         <select class="form-control" [(ngModel)]="project" size="1">
                            <option disabled selected>select project</option>
                            <option *ngFor="let projectname of projectList">{{projectname}}</option>
                         </select>
                      </div>
                   </div>
                </div>
                <div class="form-inline">
                   <div class="form-group">
                      <div class="col-md-6">
                         <input disabled class="form-control" [(ngModel)]="timePeriod" placeholder="0 sec"/>
                      </div>
                   </div>
                </div>
                <div class="form-inline">
                   <div class="form-group">
                      <div class="col-md-offset-2 col-md-6">
                         <button *ngIf="!activeTask" class="btn btn-success" (click)="startTask(name, project)">Start</button>
                         <button *ngIf="activeTask" class="btn btn-danger" (click)="endTask(name, project)">Start</button>
                      </div>
                   </div>
                </div> 
             <table>
                <tbody>
                <tr *ngFor="let task of tasks">
                   <td>{{task.name}}</td>
                   <td>{{task.project}}</td>
                   <td>{{task.endTime - task.startTime | date:"HH:mm"}}</td>
                   <td>"{{task.startTime | date:"d-MMM-yyyy HH:mm"}} - {{task.endTime | date:"d-MMM-yyyy HH:mm"}}"</td>
                </tr>
                </tbody>
             </table>
             </div>
             `,
  styleUrls: ['./app.component.css'],
  providers: [TaskService]
})
export class AppComponent implements OnInit {
  name: string;
  project: string;
  timePeriod: string;
  activeTask: boolean = false;
  title = 'IB Time Tracker';

  projectList: string[];
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private http:Http) {
    this.http.get('../assets/projectList.json').subscribe(res => this.projectList = res.json());
  }

  startTask(name: string, project: string) {
    if(name.trim()==""||name==null)
      return;
    this.taskService.startTask(name, project);
  }

  endTask(name: string, project: string) {
    this.taskService.stopTask(name, project);
  }
  ngOnInit(){
    this.tasks = this.taskService.getTasks();
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
}
