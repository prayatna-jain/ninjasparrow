import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILookupField, LookupField } from '../lookup-field.model';
import { LookupFieldService } from '../service/lookup-field.service';

@Injectable({ providedIn: 'root' })
export class LookupFieldRoutingResolveService implements Resolve<ILookupField> {
  constructor(protected service: LookupFieldService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILookupField> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lookupField: HttpResponse<LookupField>) => {
          if (lookupField.body) {
            return of(lookupField.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LookupField());
  }
}
