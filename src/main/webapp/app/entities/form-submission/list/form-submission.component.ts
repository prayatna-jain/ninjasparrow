import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormSubmission } from '../form-submission.model';
import { FormSubmissionService } from '../service/form-submission.service';
import { FormSubmissionDeleteDialogComponent } from '../delete/form-submission-delete-dialog.component';

@Component({
  selector: 'jhi-form-submission',
  templateUrl: './form-submission.component.html',
})
export class FormSubmissionComponent implements OnInit {
  formSubmissions?: IFormSubmission[];
  isLoading = false;

  constructor(protected formSubmissionService: FormSubmissionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formSubmissionService.query().subscribe(
      (res: HttpResponse<IFormSubmission[]>) => {
        this.isLoading = false;
        this.formSubmissions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFormSubmission): string {
    return item.id!;
  }

  delete(formSubmission: IFormSubmission): void {
    const modalRef = this.modalService.open(FormSubmissionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formSubmission = formSubmission;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
