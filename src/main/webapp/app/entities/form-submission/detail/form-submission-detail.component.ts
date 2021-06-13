import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormSubmission } from '../form-submission.model';

@Component({
  selector: 'jhi-form-submission-detail',
  templateUrl: './form-submission-detail.component.html',
})
export class FormSubmissionDetailComponent implements OnInit {
  formSubmission: IFormSubmission | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formSubmission }) => {
      this.formSubmission = formSubmission;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
