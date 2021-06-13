import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormElement } from '../form-element.model';
import { FormElementService } from '../service/form-element.service';

@Component({
  templateUrl: './form-element-delete-dialog.component.html',
})
export class FormElementDeleteDialogComponent {
  formElement?: IFormElement;

  constructor(protected formElementService: FormElementService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.formElementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
