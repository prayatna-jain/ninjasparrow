jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FormSubmissionService } from '../service/form-submission.service';

import { FormSubmissionDeleteDialogComponent } from './form-submission-delete-dialog.component';

describe('Component Tests', () => {
  describe('FormSubmission Management Delete Component', () => {
    let comp: FormSubmissionDeleteDialogComponent;
    let fixture: ComponentFixture<FormSubmissionDeleteDialogComponent>;
    let service: FormSubmissionService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormSubmissionDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(FormSubmissionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FormSubmissionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FormSubmissionService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('9fec3727-3421-4967-b213-ba36557ca194');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
