import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormElementComponent } from '../list/form-element.component';
import { FormElementDetailComponent } from '../detail/form-element-detail.component';
import { FormElementUpdateComponent } from '../update/form-element-update.component';
import { FormElementRoutingResolveService } from './form-element-routing-resolve.service';

const formElementRoute: Routes = [
  {
    path: '',
    component: FormElementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormElementDetailComponent,
    resolve: {
      formElement: FormElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormElementUpdateComponent,
    resolve: {
      formElement: FormElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormElementUpdateComponent,
    resolve: {
      formElement: FormElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formElementRoute)],
  exports: [RouterModule],
})
export class FormElementRoutingModule {}
