import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LookupFieldDetailComponent } from './lookup-field-detail.component';

describe('Component Tests', () => {
  describe('LookupField Management Detail Component', () => {
    let comp: LookupFieldDetailComponent;
    let fixture: ComponentFixture<LookupFieldDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LookupFieldDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ lookupField: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(LookupFieldDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LookupFieldDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load lookupField on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.lookupField).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
