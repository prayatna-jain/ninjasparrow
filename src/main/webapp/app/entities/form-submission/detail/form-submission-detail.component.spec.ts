import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormSubmissionDetailComponent } from './form-submission-detail.component';

describe('Component Tests', () => {
  describe('FormSubmission Management Detail Component', () => {
    let comp: FormSubmissionDetailComponent;
    let fixture: ComponentFixture<FormSubmissionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FormSubmissionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ formSubmission: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(FormSubmissionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FormSubmissionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load formSubmission on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.formSubmission).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
