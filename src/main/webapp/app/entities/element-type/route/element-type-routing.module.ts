import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ElementTypeComponent } from '../list/element-type.component';
import { ElementTypeDetailComponent } from '../detail/element-type-detail.component';
import { ElementTypeUpdateComponent } from '../update/element-type-update.component';
import { ElementTypeRoutingResolveService } from './element-type-routing-resolve.service';

const elementTypeRoute: Routes = [
  {
    path: '',
    component: ElementTypeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ElementTypeDetailComponent,
    resolve: {
      elementType: ElementTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ElementTypeUpdateComponent,
    resolve: {
      elementType: ElementTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ElementTypeUpdateComponent,
    resolve: {
      elementType: ElementTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(elementTypeRoute)],
  exports: [RouterModule],
})
export class ElementTypeRoutingModule {}
