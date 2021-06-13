import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormSubmissionElementDetailComponent } from './form-submission-element-detail.component';

describe('Component Tests', () => {
  describe('FormSubmissionElement Management Detail Component', () => {
    let comp: FormSubmissionElementDetailComponent;
    let fixture: ComponentFixture<FormSubmissionElementDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FormSubmissionElementDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ formSubmissionElement: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(FormSubmissionElementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FormSubmissionElementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load formSubmissionElement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.formSubmissionElement).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
