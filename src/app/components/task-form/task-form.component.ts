import { Component, inject, Signal, signal  } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import {Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../modal/task.model';
@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  isEditMode = signal(false);
  taskId?: number;

  taskForm : FormGroup = this.fb.nonNullable.group({
    title: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(5)]
    }),
    description: this.fb.control('', {
      validators: [Validators.required]
    }),
    completed: this.fb.control(true, Validators.required)
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.taskId = +idParam;//.set(+idParam);
      this.taskService.getTask(this.taskId).subscribe(task => {
        if (task) {
          this.taskForm.patchValue(task);
        }
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.taskForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.taskForm.valid) {
       const taskData = this.taskForm.value;
      if (this.isEditMode()) {
        if (!this.taskId) {
          throw new Error('Task ID is required for edit mode');
        }
        this.taskService.updateTask(this.taskId, taskData).subscribe(() => this.router.navigate(['/tasks']));
      } else {
        this.taskService.createTask(taskData).subscribe(() => this.router.navigate(['/tasks']));
      }
    }

  }

}
