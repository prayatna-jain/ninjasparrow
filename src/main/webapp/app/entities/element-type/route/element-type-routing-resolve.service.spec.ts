jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IElementType, ElementType } from '../element-type.model';
import { ElementTypeService } from '../service/element-type.service';

import { ElementTypeRoutingResolveService } from './element-type-routing-resolve.service';

describe('Service Tests', () => {
  describe('ElementType routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ElementTypeRoutingResolveService;
    let service: ElementTypeService;
    let resultElementType: IElementType | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ElementTypeRoutingResolveService);
      service = TestBed.inject(ElementTypeService);
      resultElementType = undefined;
    });

    describe('resolve', () => {
      it('should return IElementType returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultElementType = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultElementType).toEqual({ id: '9fec3727-3421-4967-b213-ba36557ca194' });
      });

      it('should return new IElementType if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultElementType = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultElementType).toEqual(new ElementType());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultElementType = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultElementType).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
