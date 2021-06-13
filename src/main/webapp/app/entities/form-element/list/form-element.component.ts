import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormElement } from '../form-element.model';
import { FormElementService } from '../service/form-element.service';
import { FormElementDeleteDialogComponent } from '../delete/form-element-delete-dialog.component';

@Component({
  selector: 'jhi-form-element',
  templateUrl: './form-element.component.html',
})
export class FormElementComponent implements OnInit {
  formElements?: IFormElement[];
  isLoading = false;

  constructor(protected formElementService: FormElementService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formElementService.query().subscribe(
      (res: HttpResponse<IFormElement[]>) => {
        this.isLoading = false;
        this.formElements = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFormElement): string {
    return item.id!;
  }

  delete(formElement: IFormElement): void {
    const modalRef = this.modalService.open(FormElementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formElement = formElement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
