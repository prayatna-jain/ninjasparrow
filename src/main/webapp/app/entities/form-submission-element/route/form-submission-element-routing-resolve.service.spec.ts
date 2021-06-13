jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFormSubmissionElement, FormSubmissionElement } from '../form-submission-element.model';
import { FormSubmissionElementService } from '../service/form-submission-element.service';

import { FormSubmissionElementRoutingResolveService } from './form-submission-element-routing-resolve.service';

describe('Service Tests', () => {
  describe('FormSubmissionElement routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FormSubmissionElementRoutingResolveService;
    let service: FormSubmissionElementService;
    let resultFormSubmissionElement: IFormSubmissionElement | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FormSubmissionElementRoutingResolveService);
      service = TestBed.inject(FormSubmissionElementService);
      resultFormSubmissionElement = undefined;
    });

    describe('resolve', () => {
      it('should return IFormSubmissionElement returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFormSubmissionElement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultFormSubmissionElement).toEqual({ id: '9fec3727-3421-4967-b213-ba36557ca194' });
      });

      it('should return new IFormSubmissionElement if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFormSubmissionElement = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFormSubmissionElement).toEqual(new FormSubmissionElement());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFormSubmissionElement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
        expect(resultFormSubmissionElement).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
