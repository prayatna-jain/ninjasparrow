import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LookupFieldComponent } from '../list/lookup-field.component';
import { LookupFieldDetailComponent } from '../detail/lookup-field-detail.component';
import { LookupFieldUpdateComponent } from '../update/lookup-field-update.component';
import { LookupFieldRoutingResolveService } from './lookup-field-routing-resolve.service';

const lookupFieldRoute: Routes = [
  {
    path: '',
    component: LookupFieldComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LookupFieldDetailComponent,
    resolve: {
      lookupField: LookupFieldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LookupFieldUpdateComponent,
    resolve: {
      lookupField: LookupFieldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LookupFieldUpdateComponent,
    resolve: {
      lookupField: LookupFieldRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lookupFieldRoute)],
  exports: [RouterModule],
})
export class LookupFieldRoutingModule {}
