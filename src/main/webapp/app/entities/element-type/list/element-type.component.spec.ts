import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ElementTypeService } from '../service/element-type.service';

import { ElementTypeComponent } from './element-type.component';

describe('Component Tests', () => {
  describe('ElementType Management Component', () => {
    let comp: ElementTypeComponent;
    let fixture: ComponentFixture<ElementTypeComponent>;
    let service: ElementTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ElementTypeComponent],
      })
        .overrideTemplate(ElementTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ElementTypeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ElementTypeService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.elementTypes?.[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
