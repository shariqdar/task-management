
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  template: `
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ message }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" (click)="confirm()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDeleteModalComponent {
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Output() onConfirm = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
    (window as any).bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
  }
}

