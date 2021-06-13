import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormSubmissionElementComponent } from '../list/form-submission-element.component';
import { FormSubmissionElementDetailComponent } from '../detail/form-submission-element-detail.component';
import { FormSubmissionElementUpdateComponent } from '../update/form-submission-element-update.component';
import { FormSubmissionElementRoutingResolveService } from './form-submission-element-routing-resolve.service';

const formSubmissionElementRoute: Routes = [
  {
    path: '',
    component: FormSubmissionElementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormSubmissionElementDetailComponent,
    resolve: {
      formSubmissionElement: FormSubmissionElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormSubmissionElementUpdateComponent,
    resolve: {
      formSubmissionElement: FormSubmissionElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormSubmissionElementUpdateComponent,
    resolve: {
      formSubmissionElement: FormSubmissionElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formSubmissionElementRoute)],
  exports: [RouterModule],
})
export class FormSubmissionElementRoutingModule {}
