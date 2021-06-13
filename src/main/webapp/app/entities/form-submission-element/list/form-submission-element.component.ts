import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormSubmissionElement } from '../form-submission-element.model';
import { FormSubmissionElementService } from '../service/form-submission-element.service';
import { FormSubmissionElementDeleteDialogComponent } from '../delete/form-submission-element-delete-dialog.component';

@Component({
  selector: 'jhi-form-submission-element',
  templateUrl: './form-submission-element.component.html',
})
export class FormSubmissionElementComponent implements OnInit {
  formSubmissionElements?: IFormSubmissionElement[];
  isLoading = false;

  constructor(protected formSubmissionElementService: FormSubmissionElementService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formSubmissionElementService.query().subscribe(
      (res: HttpResponse<IFormSubmissionElement[]>) => {
        this.isLoading = false;
        this.formSubmissionElements = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFormSubmissionElement): string {
    return item.id!;
  }

  delete(formSubmissionElement: IFormSubmissionElement): void {
    const modalRef = this.modalService.open(FormSubmissionElementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formSubmissionElement = formSubmissionElement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
