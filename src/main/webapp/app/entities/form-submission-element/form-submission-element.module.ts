import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FormSubmissionElementComponent } from './list/form-submission-element.component';
import { FormSubmissionElementDetailComponent } from './detail/form-submission-element-detail.component';
import { FormSubmissionElementUpdateComponent } from './update/form-submission-element-update.component';
import { FormSubmissionElementDeleteDialogComponent } from './delete/form-submission-element-delete-dialog.component';
import { FormSubmissionElementRoutingModule } from './route/form-submission-element-routing.module';

@NgModule({
  imports: [SharedModule, FormSubmissionElementRoutingModule],
  declarations: [
    FormSubmissionElementComponent,
    FormSubmissionElementDetailComponent,
    FormSubmissionElementUpdateComponent,
    FormSubmissionElementDeleteDialogComponent,
  ],
  entryComponents: [FormSubmissionElementDeleteDialogComponent],
})
export class FormSubmissionElementModule {}
