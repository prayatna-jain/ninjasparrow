import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormElementService } from '../service/form-element.service';

import { FormElementComponent } from './form-element.component';

describe('Component Tests', () => {
  describe('FormElement Management Component', () => {
    let comp: FormElementComponent;
    let fixture: ComponentFixture<FormElementComponent>;
    let service: FormElementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormElementComponent],
      })
        .overrideTemplate(FormElementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormElementComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FormElementService);

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
      expect(comp.formElements?.[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
