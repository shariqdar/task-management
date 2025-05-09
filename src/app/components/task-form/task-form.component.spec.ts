import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import {Task} from '../../modal/task.model';


describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockRouter: jasmine.SpyObj<Router>;
  const task: Task = { id: 1, title: 'Test Task Title1',description:'Test Task Description1', completed: false };

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTask', 'createTask', 'updateTask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent], // Since it's standalone
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map() } // override in tests
          }
        }
      ]
    }).compileComponents();
    mockTaskService.getTask.and.returnValue(of(task));
    mockTaskService.createTask.and.returnValue(of(task));
    mockTaskService.updateTask.and.returnValue(of(void 0));
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', () => {
    expect(component.isEditMode()).toBeFalse();
    expect(component.taskForm.valid).toBeFalse();
  });

  it('should set edit mode and patch form if task ID is present', fakeAsync(() => {
    
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.paramMap as any).get = () => '1';

    component.ngOnInit();
    tick();

    expect(component.isEditMode()).toBeTrue();
    expect(component.taskForm.value).toEqual({title: 'Test Task Title1',description:'Test Task Description1', completed: false });
  }));

  it('should call createTask and navigate on valid form submit in create mode', () => {
    component.taskForm.setValue({ title: 'Valid Title', description: 'Desc', completed: true });
    component.onSubmit();
    expect(mockTaskService.createTask).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should call updateTask and navigate on valid form submit in edit mode', () => {
    component.isEditMode.set(true);
    component.taskId = 2;
    component.taskForm.setValue({ title: 'Edit Title', description: 'Edit Desc', completed: false });

    component.onSubmit();

    expect(mockTaskService.updateTask).toHaveBeenCalledWith(2, jasmine.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should not submit if form is invalid', () => {
    component.taskForm.setValue({ title: '', description: '', completed: true });

    component.onSubmit();

    expect(mockTaskService.createTask).not.toHaveBeenCalled();
    expect(mockTaskService.updateTask).not.toHaveBeenCalled();
  });
});

// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { TaskFormComponent } from './task-form.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';

// describe('TaskFormComponent', () => {
//   let component: TaskFormComponent;
//   let fixture: ComponentFixture<TaskFormComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [TaskFormComponent, HttpClientTestingModule],
//       providers: [
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             paramMap: of({ get: () => null }),
//             snapshot: { paramMap: { get: () => null } }
//           }
//         }
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(TaskFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
