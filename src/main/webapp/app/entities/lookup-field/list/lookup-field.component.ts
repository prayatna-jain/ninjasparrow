import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILookupField } from '../lookup-field.model';
import { LookupFieldService } from '../service/lookup-field.service';
import { LookupFieldDeleteDialogComponent } from '../delete/lookup-field-delete-dialog.component';

@Component({
  selector: 'jhi-lookup-field',
  templateUrl: './lookup-field.component.html',
})
export class LookupFieldComponent implements OnInit {
  lookupFields?: ILookupField[];
  isLoading = false;

  constructor(protected lookupFieldService: LookupFieldService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.lookupFieldService.query().subscribe(
      (res: HttpResponse<ILookupField[]>) => {
        this.isLoading = false;
        this.lookupFields = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILookupField): string {
    return item.id!;
  }

  delete(lookupField: ILookupField): void {
    const modalRef = this.modalService.open(LookupFieldDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lookupField = lookupField;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
