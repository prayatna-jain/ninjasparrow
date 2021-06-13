import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IElementType, ElementType } from '../element-type.model';

import { ElementTypeService } from './element-type.service';

describe('Service Tests', () => {
  describe('ElementType Service', () => {
    let service: ElementTypeService;
    let httpMock: HttpTestingController;
    let elemDefault: IElementType;
    let expectedResult: IElementType | IElementType[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ElementTypeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        name: 'AAAAAAA',
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

      it('should create a ElementType', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ElementType()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ElementType', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ElementType', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new ElementType()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ElementType', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            name: 'BBBBBB',
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

      it('should delete a ElementType', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addElementTypeToCollectionIfMissing', () => {
        it('should add a ElementType to an empty array', () => {
          const elementType: IElementType = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addElementTypeToCollectionIfMissing([], elementType);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(elementType);
        });

        it('should not add a ElementType to an array that contains it', () => {
          const elementType: IElementType = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const elementTypeCollection: IElementType[] = [
            {
              ...elementType,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addElementTypeToCollectionIfMissing(elementTypeCollection, elementType);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ElementType to an array that doesn't contain it", () => {
          const elementType: IElementType = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const elementTypeCollection: IElementType[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addElementTypeToCollectionIfMissing(elementTypeCollection, elementType);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(elementType);
        });

        it('should add only unique ElementType to an array', () => {
          const elementTypeArray: IElementType[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: '947ea7e2-89fe-4f4b-8fbd-a35d13e344d4' },
          ];
          const elementTypeCollection: IElementType[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addElementTypeToCollectionIfMissing(elementTypeCollection, ...elementTypeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const elementType: IElementType = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const elementType2: IElementType = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addElementTypeToCollectionIfMissing([], elementType, elementType2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(elementType);
          expect(expectedResult).toContain(elementType2);
        });

        it('should accept null and undefined values', () => {
          const elementType: IElementType = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addElementTypeToCollectionIfMissing([], null, elementType, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(elementType);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
