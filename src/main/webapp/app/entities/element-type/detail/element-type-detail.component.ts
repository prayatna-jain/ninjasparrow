import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IElementType } from '../element-type.model';

@Component({
  selector: 'jhi-element-type-detail',
  templateUrl: './element-type-detail.component.html',
})
export class ElementTypeDetailComponent implements OnInit {
  elementType: IElementType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ elementType }) => {
      this.elementType = elementType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
