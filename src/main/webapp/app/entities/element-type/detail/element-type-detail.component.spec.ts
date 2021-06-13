import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ElementTypeDetailComponent } from './element-type-detail.component';

describe('Component Tests', () => {
  describe('ElementType Management Detail Component', () => {
    let comp: ElementTypeDetailComponent;
    let fixture: ComponentFixture<ElementTypeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ElementTypeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ elementType: { id: '9fec3727-3421-4967-b213-ba36557ca194' } }) },
          },
        ],
      })
        .overrideTemplate(ElementTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ElementTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load elementType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.elementType).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
      });
    });
  });
});
