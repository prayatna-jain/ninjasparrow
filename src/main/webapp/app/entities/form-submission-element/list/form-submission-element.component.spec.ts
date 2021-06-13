import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormSubmissionElementService } from '../service/form-submission-element.service';

import { FormSubmissionElementComponent } from './form-submission-element.component';

describe('Component Tests', () => {
  describe('FormSubmissionElement Management Component', () => {
    let comp: FormSubmissionElementComponent;
    let fixture: ComponentFixture<FormSubmissionElementComponent>;
    let service: FormSubmissionElementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormSubmissionElementComponent],
      })
        .overrideTemplate(FormSubmissionElementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormSubmissionElementComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FormSubmissionElementService);

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
      expect(comp.formSubmissionElements?.[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
