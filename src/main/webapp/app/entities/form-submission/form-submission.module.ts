import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FormSubmissionComponent } from './list/form-submission.component';
import { FormSubmissionDetailComponent } from './detail/form-submission-detail.component';
import { FormSubmissionUpdateComponent } from './update/form-submission-update.component';
import { FormSubmissionDeleteDialogComponent } from './delete/form-submission-delete-dialog.component';
import { FormSubmissionRoutingModule } from './route/form-submission-routing.module';

@NgModule({
  imports: [SharedModule, FormSubmissionRoutingModule],
  declarations: [
    FormSubmissionComponent,
    FormSubmissionDetailComponent,
    FormSubmissionUpdateComponent,
    FormSubmissionDeleteDialogComponent,
  ],
  entryComponents: [FormSubmissionDeleteDialogComponent],
})
export class FormSubmissionModule {}
