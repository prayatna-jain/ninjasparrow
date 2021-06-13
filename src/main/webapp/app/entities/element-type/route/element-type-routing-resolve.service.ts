import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IElementType, ElementType } from '../element-type.model';
import { ElementTypeService } from '../service/element-type.service';

@Injectable({ providedIn: 'root' })
export class ElementTypeRoutingResolveService implements Resolve<IElementType> {
  constructor(protected service: ElementTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IElementType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((elementType: HttpResponse<ElementType>) => {
          if (elementType.body) {
            return of(elementType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ElementType());
  }
}
