import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormSubmissionComponent } from '../list/form-submission.component';
import { FormSubmissionDetailComponent } from '../detail/form-submission-detail.component';
import { FormSubmissionUpdateComponent } from '../update/form-submission-update.component';
import { FormSubmissionRoutingResolveService } from './form-submission-routing-resolve.service';

const formSubmissionRoute: Routes = [
  {
    path: '',
    component: FormSubmissionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormSubmissionDetailComponent,
    resolve: {
      formSubmission: FormSubmissionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormSubmissionUpdateComponent,
    resolve: {
      formSubmission: FormSubmissionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormSubmissionUpdateComponent,
    resolve: {
      formSubmission: FormSubmissionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formSubmissionRoute)],
  exports: [RouterModule],
})
export class FormSubmissionRoutingModule {}
