export class Task {
  name: string;
  project: string;
  startTime: Date;
  endTime: Date;

  constructor(name: string, project: string, startTime: Date, endTime: Date) {
    this.name = name;
    this.project = project;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
