import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILookupField } from '../lookup-field.model';

@Component({
  selector: 'jhi-lookup-field-detail',
  templateUrl: './lookup-field-detail.component.html',
})
export class LookupFieldDetailComponent implements OnInit {
  lookupField: ILookupField | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lookupField }) => {
      this.lookupField = lookupField;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
