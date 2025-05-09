import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task, TaskAPIResponse } from '../../modal/task.model';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [CommonModule, RouterModule, ConfirmDeleteModalComponent, FormsModule ]
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  private router = inject(Router);

  title = signal('Task List');
  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  searchTerm = signal('');
  currentPage = 1;//signal(1);
  totalPages = 0;
  totalPagesArray:number[] = []
  pageSize = 5;
  totalSize = 0;
  sortColumn = signal<keyof Task | ''>('');
  sortAsc = signal(true);

  selectedTaskId: number | null = null;

  constructor() {
    this.fetchTasks(1);
  }

  fetchTasks(page: number): void {
    this.loading.set(true);
    this.taskService.getTasks(page, this.pageSize).subscribe({
      next: (response) => {
        this.tasks.set(response.tasks);
        this.totalSize = response.totalRecords;
        this.totalPages = Math.ceil(this.totalSize/this.pageSize);
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1)
        this.currentPage = page;
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks.');
        this.loading.set(false);
      }
    });
  }

  deleteTask(id: number): void {
    this.selectedTaskId = id;
    const modalEl = document.getElementById('confirmDeleteModal');
    if (modalEl) {
      new (window as any).bootstrap.Modal(modalEl).show();
    }
  }

  handleDelete() {
    if (this.selectedTaskId !== null) {
      this.taskService.deleteTask(this.selectedTaskId).subscribe(() => {
        this.fetchTasks(1);
      });
    }
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  // Search + Sort
  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let filtered = this.tasks().filter(task =>
      Object.values(task).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );

    const column = this.sortColumn();
    const ascending = this.sortAsc();

    if (column) {
      filtered.sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        return ascending
          ? valA > valB ? 1 : -1
          : valA < valB ? 1 : -1;
      });
    }
    return filtered;
  });

  paginatedTasks = computed(() => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTasks().slice(start, start + this.pageSize);
  });

  // Pagination Controls
  goToPage(page: number) {
    this.fetchTasks(page)
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.fetchTasks(this.currentPage)
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.fetchTasks(this.currentPage)
    }
  }

  onSearch() {
    //this.currentPage = 1;//.set(1); // reset to first page on search
    
  }

  // Sorting Controls
  sortBy(column: keyof Task) {
    if (this.sortColumn() === column) {
      this.sortAsc.set(!this.sortAsc());
    } else {
      this.sortColumn.set(column);
      this.sortAsc.set(true);
    }
  }

  getSortIcon(column: keyof Task): string {
    if (this.sortColumn() !== column) return 'bi';
    return this.sortAsc() ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill';
  }
}


// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { TaskService } from '../../services/task.service';
// import { Task } from '../../modal/task.model';
// import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

// @Component({
//   standalone: true,
//   selector: 'app-task-list',
//   templateUrl: './task-list.component.html',
//   styleUrls: ['./task-list.component.scss'],
//   imports: [CommonModule, RouterModule, ConfirmDeleteModalComponent]
// })
// export class TaskListComponent {
//   private taskService = inject(TaskService);
//   //private router = inject(Router);
//   title = signal("Task List");
//   tasks = signal<Task[]>([]);
//   loading = signal(true);
//   error = signal<string | null>(null);

//   selectedTaskId: number | null = null;

//   constructor(private router: Router) {
//     this.fetchTasks();
//   }

//   fetchTasks(): void {
//     this.loading.set(true);
//     this.taskService.getTasks().subscribe({
//       next: (data) => {
//         this.tasks.set(data);
//         this.loading.set(false);
//       },
//       error: () => {
//         this.error.set('Failed to load tasks.');
//         this.loading.set(false);
//       }
//     });
//   }

//   handleDelete() {
//     console.log("this.selectedTaskId::",this.selectedTaskId)
//     if (this.selectedTaskId !== null) {
//       console.log("this.selectedTaskIdinside::",this.selectedTaskId)
//       this.taskService.deleteTask(this.selectedTaskId).subscribe(() => {
//         console.log("inside::::")
//         this.fetchTasks();
//       });
//     }
//   }

//   deleteTask(id: number): void {
//     this.selectedTaskId = id;
//     const modalEl = document.getElementById('confirmDeleteModal');
//     if (modalEl) {
//       new (window as any).bootstrap.Modal(modalEl).show();
//     }
//   }

//   editTask(id: number): void {
//     this.router.navigate(['/tasks', id, 'edit']);
//   }

  
// }

