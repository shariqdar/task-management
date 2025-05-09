import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal.component';
import { By } from '@angular/platform-browser';

describe('ConfirmDeleteModalComponent', () => {
  let fixture: ComponentFixture<ConfirmDeleteModalComponent>;
  let component: ConfirmDeleteModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDeleteModalComponent], // standalone
    });

    fixture = TestBed.createComponent(ConfirmDeleteModalComponent);
    component = fixture.componentInstance;
  });

  it('should display default message if no input is set', () => {
    fixture.detectChanges();
    const modalBody = fixture.nativeElement.querySelector('.modal-body');
    expect(modalBody.textContent).toContain('Are you sure you want to delete this item?');
  });

  it('should display custom message if input is set', () => {
    component.message = 'Do you really want to remove this task?';
    fixture.detectChanges();
    const modalBody = fixture.nativeElement.querySelector('.modal-body');
    expect(modalBody.textContent).toContain('Do you really want to remove this task?');
  });

  it('should emit onConfirm when confirm is called', () => {
    spyOn(component.onConfirm, 'emit');

    // Mock Bootstrap modal instance
    const mockHide = jasmine.createSpy('hide');
    spyOn(document, 'getElementById').and.returnValue({
      id: 'confirmDeleteModal',
    } as any);
    (window as any).bootstrap = {
      Modal: {
        getInstance: () => ({ hide: mockHide }),
      },
    };

    component.confirm();

    expect(component.onConfirm.emit).toHaveBeenCalled();
    expect(mockHide).toHaveBeenCalled();
  });

  it('should trigger confirm() when delete button is clicked', () => {
    spyOn(component, 'confirm');
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('.btn-danger')).nativeElement;
    deleteButton.click();

    expect(component.confirm).toHaveBeenCalled();
  });
});

// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ConfirmDeleteModalComponent } from './confirm-delete-modal.component';

// describe('ConfirmDeleteModalComponent', () => {
//   let component: ConfirmDeleteModalComponent;
//   let fixture: ComponentFixture<ConfirmDeleteModalComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ConfirmDeleteModalComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ConfirmDeleteModalComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
