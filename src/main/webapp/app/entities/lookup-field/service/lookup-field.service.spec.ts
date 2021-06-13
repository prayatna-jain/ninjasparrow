import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILookupField, LookupField } from '../lookup-field.model';

import { LookupFieldService } from './lookup-field.service';

describe('Service Tests', () => {
  describe('LookupField Service', () => {
    let service: LookupFieldService;
    let httpMock: HttpTestingController;
    let elemDefault: ILookupField;
    let expectedResult: ILookupField | ILookupField[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LookupFieldService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        formId: 'AAAAAAA',
        elementId: 'AAAAAAA',
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

      it('should create a LookupField', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new LookupField()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a LookupField', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            formId: 'BBBBBB',
            elementId: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a LookupField', () => {
        const patchObject = Object.assign(
          {
            formId: 'BBBBBB',
          },
          new LookupField()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of LookupField', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            formId: 'BBBBBB',
            elementId: 'BBBBBB',
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

      it('should delete a LookupField', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLookupFieldToCollectionIfMissing', () => {
        it('should add a LookupField to an empty array', () => {
          const lookupField: ILookupField = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addLookupFieldToCollectionIfMissing([], lookupField);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lookupField);
        });

        it('should not add a LookupField to an array that contains it', () => {
          const lookupField: ILookupField = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const lookupFieldCollection: ILookupField[] = [
            {
              ...lookupField,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addLookupFieldToCollectionIfMissing(lookupFieldCollection, lookupField);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a LookupField to an array that doesn't contain it", () => {
          const lookupField: ILookupField = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const lookupFieldCollection: ILookupField[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addLookupFieldToCollectionIfMissing(lookupFieldCollection, lookupField);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lookupField);
        });

        it('should add only unique LookupField to an array', () => {
          const lookupFieldArray: ILookupField[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: '937fd025-dde4-44ed-b37e-40f303383d59' },
          ];
          const lookupFieldCollection: ILookupField[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addLookupFieldToCollectionIfMissing(lookupFieldCollection, ...lookupFieldArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const lookupField: ILookupField = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const lookupField2: ILookupField = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addLookupFieldToCollectionIfMissing([], lookupField, lookupField2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lookupField);
          expect(expectedResult).toContain(lookupField2);
        });

        it('should accept null and undefined values', () => {
          const lookupField: ILookupField = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addLookupFieldToCollectionIfMissing([], null, lookupField, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lookupField);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
