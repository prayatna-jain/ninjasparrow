import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormSubmissionElement } from '../form-submission-element.model';
import { FormSubmissionElementService } from '../service/form-submission-element.service';

@Component({
  templateUrl: './form-submission-element-delete-dialog.component.html',
})
export class FormSubmissionElementDeleteDialogComponent {
  formSubmissionElement?: IFormSubmissionElement;

  constructor(protected formSubmissionElementService: FormSubmissionElementService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.formSubmissionElementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
