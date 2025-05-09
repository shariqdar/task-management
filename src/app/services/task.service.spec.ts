import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task, TaskAPIResponse } from '../modal/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no pending requests
  });

  const dummyTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Desc 1', completed: false },
    { id: 2, title: 'Task 2', description: 'Desc 2', completed: true }
  ];
  const mockResponse: TaskAPIResponse = {page:1, size: 5, tasks: dummyTasks, totalRecords: 11}

  it('should fetch all tasks', () => {
    service.getTasks(1,5).subscribe(response => {
      expect(response.tasks.length).toBe(2);
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks?page=1&size=5');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch a task by ID', () => {
    service.getTask(1).subscribe(task => {
      expect(task).toEqual(dummyTasks[0]);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks[0]);
  });

  it('should create a task', () => {
    const newTask = { title: 'New', description: 'New Desc', completed: false };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual({ id: 3, ...newTask });
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush({ id: 3, ...newTask });
  });

  it('should update a task', () => {
    const updatedTask = { id: 1, title: 'Updated', description: 'Updated Desc', completed: true };

    service.updateTask(1, updatedTask).subscribe(res => {
        console.log("res:::",res)
      expect(res).toBeNull();//.toBeUndefined(); // because return type is void
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);

    req.flush(null); // for void
  });

  it('should delete a task', () => {
    service.deleteTask(1).subscribe(res => {
      expect(res).toBeNull();//.toBeUndefined(); // void
    });

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(req.request.method).toBe('DELETE');

    req.flush(null); // for void
  });
});
