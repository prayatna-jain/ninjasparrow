import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormSubmission } from '../form-submission.model';
import { FormSubmissionService } from '../service/form-submission.service';

@Component({
  templateUrl: './form-submission-delete-dialog.component.html',
})
export class FormSubmissionDeleteDialogComponent {
  formSubmission?: IFormSubmission;

  constructor(protected formSubmissionService: FormSubmissionService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.formSubmissionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
