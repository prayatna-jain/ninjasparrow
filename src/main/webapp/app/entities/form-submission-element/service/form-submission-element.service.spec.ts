import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFormSubmissionElement, FormSubmissionElement } from '../form-submission-element.model';

import { FormSubmissionElementService } from './form-submission-element.service';

describe('Service Tests', () => {
  describe('FormSubmissionElement Service', () => {
    let service: FormSubmissionElementService;
    let httpMock: HttpTestingController;
    let elemDefault: IFormSubmissionElement;
    let expectedResult: IFormSubmissionElement | IFormSubmissionElement[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FormSubmissionElementService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        value: 'AAAAAAA',
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

      it('should create a FormSubmissionElement', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new FormSubmissionElement()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FormSubmissionElement', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            value: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a FormSubmissionElement', () => {
        const patchObject = Object.assign({}, new FormSubmissionElement());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FormSubmissionElement', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            value: 'BBBBBB',
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

      it('should delete a FormSubmissionElement', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFormSubmissionElementToCollectionIfMissing', () => {
        it('should add a FormSubmissionElement to an empty array', () => {
          const formSubmissionElement: IFormSubmissionElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addFormSubmissionElementToCollectionIfMissing([], formSubmissionElement);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(formSubmissionElement);
        });

        it('should not add a FormSubmissionElement to an array that contains it', () => {
          const formSubmissionElement: IFormSubmissionElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formSubmissionElementCollection: IFormSubmissionElement[] = [
            {
              ...formSubmissionElement,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addFormSubmissionElementToCollectionIfMissing(formSubmissionElementCollection, formSubmissionElement);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FormSubmissionElement to an array that doesn't contain it", () => {
          const formSubmissionElement: IFormSubmissionElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formSubmissionElementCollection: IFormSubmissionElement[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addFormSubmissionElementToCollectionIfMissing(formSubmissionElementCollection, formSubmissionElement);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(formSubmissionElement);
        });

        it('should add only unique FormSubmissionElement to an array', () => {
          const formSubmissionElementArray: IFormSubmissionElement[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: '0d37b010-0d78-4881-b9ba-015ababd79b8' },
          ];
          const formSubmissionElementCollection: IFormSubmissionElement[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addFormSubmissionElementToCollectionIfMissing(
            formSubmissionElementCollection,
            ...formSubmissionElementArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const formSubmissionElement: IFormSubmissionElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formSubmissionElement2: IFormSubmissionElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addFormSubmissionElementToCollectionIfMissing([], formSubmissionElement, formSubmissionElement2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(formSubmissionElement);
          expect(expectedResult).toContain(formSubmissionElement2);
        });

        it('should accept null and undefined values', () => {
          const formSubmissionElement: IFormSubmissionElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addFormSubmissionElementToCollectionIfMissing([], null, formSubmissionElement, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(formSubmissionElement);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
