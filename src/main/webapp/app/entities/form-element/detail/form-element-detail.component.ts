import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormElement } from '../form-element.model';

@Component({
  selector: 'jhi-form-element-detail',
  templateUrl: './form-element-detail.component.html',
})
export class FormElementDetailComponent implements OnInit {
  formElement: IFormElement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formElement }) => {
      this.formElement = formElement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
