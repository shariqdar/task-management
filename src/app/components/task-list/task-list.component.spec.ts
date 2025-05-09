import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { TaskListComponent } from './task-list.component';
import { of } from 'rxjs';
import {Task, TaskAPIResponse} from '../../modal/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  const mockTasks: Task[] = [{ id: 1, title: 'Test Task Title1',description:'Test Task Description1', completed: false }];
  const mockResponse: TaskAPIResponse = {page:1, size: 5, tasks: mockTasks, totalRecords: 11}
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks', 'deleteTask']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    })
    .compileComponents();
    mockTaskService.getTasks.and.returnValue(of(mockResponse));
    mockTaskService.deleteTask.and.returnValue(of(void 0));
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined title', () => {
    expect(component.title).toBeDefined(); // Just checks title is not undefined
  });

  it('should have the correct title', () => {
    expect(component.title()).toEqual('Task List');
  });

  it('should render title in the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Task List');
  });

  it('should fetch tasks successfully', () => {
    expect(mockTaskService.getTasks).toHaveBeenCalled();
    expect(component.tasks()).toEqual(mockTasks);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });

  it('should call router.navigate on editTask()', () => {
    component.editTask(42);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks', 42, 'edit']);
  });

  it('should handleDelete and refetch tasks', () => {
    component.selectedTaskId = 7;
    const fetchSpy = spyOn(component, 'fetchTasks');
    component.handleDelete();
    fixture.detectChanges();
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(7);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should test deleteTask and open delete modal', () => {
    const fakeModalEl = document.createElement('div');
    fakeModalEl.id = 'confirmDeleteModal';
    document.body.appendChild(fakeModalEl);
  
    const showSpy = jasmine.createSpy('show');
    (window as any).bootstrap = {
      Modal: function () {
        return { show: showSpy };
      }
    };
  
    component.deleteTask(3);
    expect(component.selectedTaskId).toBe(3);
    expect(showSpy).toHaveBeenCalled();
  
    document.body.removeChild(fakeModalEl); // cleanup
  });

});
