jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LookupFieldService } from '../service/lookup-field.service';

import { LookupFieldDeleteDialogComponent } from './lookup-field-delete-dialog.component';

describe('Component Tests', () => {
  describe('LookupField Management Delete Component', () => {
    let comp: LookupFieldDeleteDialogComponent;
    let fixture: ComponentFixture<LookupFieldDeleteDialogComponent>;
    let service: LookupFieldService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LookupFieldDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(LookupFieldDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LookupFieldDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LookupFieldService);
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
