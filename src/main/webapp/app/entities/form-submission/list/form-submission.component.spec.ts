import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormSubmissionService } from '../service/form-submission.service';

import { FormSubmissionComponent } from './form-submission.component';

describe('Component Tests', () => {
  describe('FormSubmission Management Component', () => {
    let comp: FormSubmissionComponent;
    let fixture: ComponentFixture<FormSubmissionComponent>;
    let service: FormSubmissionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormSubmissionComponent],
      })
        .overrideTemplate(FormSubmissionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormSubmissionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FormSubmissionService);

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
      expect(comp.formSubmissions?.[0]).toEqual(jasmine.objectContaining({ id: '9fec3727-3421-4967-b213-ba36557ca194' }));
    });
  });
});
