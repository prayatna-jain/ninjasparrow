import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormElementDetailComponent } from './form-element-detail.component';

describe('Component Tests', () => {
  describe('FormElement Management Detail Component', () => {
    let comp: FormElementDetailComponent;
    let fixture: ComponentFixture<FormElementDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FormElementDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ formElement: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(FormElementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FormElementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load formElement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.formElement).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
