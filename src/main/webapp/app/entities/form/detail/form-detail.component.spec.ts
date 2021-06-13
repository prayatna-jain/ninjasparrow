import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormDetailComponent } from './form-detail.component';

describe('Component Tests', () => {
  describe('Form Management Detail Component', () => {
    let comp: FormDetailComponent;
    let fixture: ComponentFixture<FormDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FormDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ form: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(FormDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FormDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load form on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.form).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
