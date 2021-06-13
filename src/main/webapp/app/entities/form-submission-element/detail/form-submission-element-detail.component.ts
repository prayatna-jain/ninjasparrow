import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormSubmissionElement } from '../form-submission-element.model';

@Component({
  selector: 'jhi-form-submission-element-detail',
  templateUrl: './form-submission-element-detail.component.html',
})
export class FormSubmissionElementDetailComponent implements OnInit {
  formSubmissionElement: IFormSubmissionElement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formSubmissionElement }) => {
      this.formSubmissionElement = formSubmissionElement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
