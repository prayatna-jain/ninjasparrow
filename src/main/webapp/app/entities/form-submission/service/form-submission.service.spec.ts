import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFormSubmission, FormSubmission } from '../form-submission.model';

import { FormSubmissionService } from './form-submission.service';

describe('Service Tests', () => {
  describe('FormSubmission Service', () => {
    let service: FormSubmissionService;
    let httpMock: HttpTestingController;
    let elemDefault: IFormSubmission;
    let expectedResult: IFormSubmission | IFormSubmission[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FormSubmissionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        formId: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a FormSubmission', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new FormSubmission()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FormSubmission', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            formId: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a FormSubmission', () => {
        const patchObject = Object.assign({}, new FormSubmission());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FormSubmission', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            formId: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a FormSubmission', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFormSubmissionToCollectionIfMissing', () => {
        it('should add a FormSubmission to an empty array', () => {
          const formSubmission: IFormSubmission = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addFormSubmissionToCollectionIfMissing([], formSubmission);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(formSubmission);
        });

        it('should not add a FormSubmission to an array that contains it', () => {
          const formSubmission: IFormSubmission = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formSubmissionCollection: IFormSubmission[] = [
            {
              ...formSubmission,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addFormSubmissionToCollectionIfMissing(formSubmissionCollection, formSubmission);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FormSubmission to an array that doesn't contain it", () => {
          const formSubmission: IFormSubmission = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formSubmissionCollection: IFormSubmission[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addFormSubmissionToCollectionIfMissing(formSubmissionCollection, formSubmission);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(formSubmission);
        });

        it('should add only unique FormSubmission to an array', () => {
          const formSubmissionArray: IFormSubmission[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: '1a32848e-a959-4273-ada4-b2680413115b' },
          ];
          const formSubmissionCollection: IFormSubmission[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addFormSubmissionToCollectionIfMissing(formSubmissionCollection, ...formSubmissionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const formSubmission: IFormSubmission = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formSubmission2: IFormSubmission = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addFormSubmissionToCollectionIfMissing([], formSubmission, formSubmission2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(formSubmission);
          expect(expectedResult).toContain(formSubmission2);
        });

        it('should accept null and undefined values', () => {
          const formSubmission: IFormSubmission = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addFormSubmissionToCollectionIfMissing([], null, formSubmission, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(formSubmission);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
