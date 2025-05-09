import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskAPIResponse } from '../modal/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks'; // adjust if needed

  constructor(private http: HttpClient) {}

  getTasks(page: number, size: number): Observable<TaskAPIResponse> {
    return this.http.get<TaskAPIResponse>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: {
                    title: string;
                    description: string;
                    completed: boolean;
  }): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: number, task: Task): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
}
