import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILookupField } from '../lookup-field.model';
import { LookupFieldService } from '../service/lookup-field.service';

@Component({
  templateUrl: './lookup-field-delete-dialog.component.html',
})
export class LookupFieldDeleteDialogComponent {
  lookupField?: ILookupField;

  constructor(protected lookupFieldService: LookupFieldService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.lookupFieldService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
