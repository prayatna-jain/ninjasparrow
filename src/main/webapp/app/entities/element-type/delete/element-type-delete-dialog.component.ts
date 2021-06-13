import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IElementType } from '../element-type.model';
import { ElementTypeService } from '../service/element-type.service';

@Component({
  templateUrl: './element-type-delete-dialog.component.html',
})
export class ElementTypeDeleteDialogComponent {
  elementType?: IElementType;

  constructor(protected elementTypeService: ElementTypeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.elementTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
