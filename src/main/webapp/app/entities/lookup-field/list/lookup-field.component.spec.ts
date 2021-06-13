import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LookupFieldService } from '../service/lookup-field.service';

import { LookupFieldComponent } from './lookup-field.component';

describe('Component Tests', () => {
  describe('LookupField Management Component', () => {
    let comp: LookupFieldComponent;
    let fixture: ComponentFixture<LookupFieldComponent>;
    let service: LookupFieldService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LookupFieldComponent],
      })
        .overrideTemplate(LookupFieldComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LookupFieldComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LookupFieldService);

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
      expect(comp.lookupFields?.[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
