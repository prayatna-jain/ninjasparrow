import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFormElement, FormElement } from '../form-element.model';

import { FormElementService } from './form-element.service';

describe('Service Tests', () => {
  describe('FormElement Service', () => {
    let service: FormElementService;
    let httpMock: HttpTestingController;
    let elemDefault: IFormElement;
    let expectedResult: IFormElement | IFormElement[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FormElementService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        name: 'AAAAAAA',
        formId: 'AAAAAAA',
        elementTypeId: 'AAAAAAA',
        lookupFieldId: 'AAAAAAA',
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

      it('should create a FormElement', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new FormElement()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FormElement', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            formId: 'BBBBBB',
            elementTypeId: 'BBBBBB',
            lookupFieldId: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a FormElement', () => {
        const patchObject = Object.assign(
          {
            elementTypeId: 'BBBBBB',
            lookupFieldId: 'BBBBBB',
          },
          new FormElement()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FormElement', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
            formId: 'BBBBBB',
            elementTypeId: 'BBBBBB',
            lookupFieldId: 'BBBBBB',
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

      it('should delete a FormElement', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFormElementToCollectionIfMissing', () => {
        it('should add a FormElement to an empty array', () => {
          const formElement: IFormElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addFormElementToCollectionIfMissing([], formElement);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(formElement);
        });

        it('should not add a FormElement to an array that contains it', () => {
          const formElement: IFormElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formElementCollection: IFormElement[] = [
            {
              ...formElement,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addFormElementToCollectionIfMissing(formElementCollection, formElement);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FormElement to an array that doesn't contain it", () => {
          const formElement: IFormElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formElementCollection: IFormElement[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addFormElementToCollectionIfMissing(formElementCollection, formElement);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(formElement);
        });

        it('should add only unique FormElement to an array', () => {
          const formElementArray: IFormElement[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: 'ad2fdba4-6e8a-44d9-a652-873e2296d75a' },
          ];
          const formElementCollection: IFormElement[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addFormElementToCollectionIfMissing(formElementCollection, ...formElementArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const formElement: IFormElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const formElement2: IFormElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addFormElementToCollectionIfMissing([], formElement, formElement2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(formElement);
          expect(expectedResult).toContain(formElement2);
        });

        it('should accept null and undefined values', () => {
          const formElement: IFormElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addFormElementToCollectionIfMissing([], null, formElement, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(formElement);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
