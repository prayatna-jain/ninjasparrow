import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IElementType, ElementType } from '../element-type.model';
import { ElementTypeService } from '../service/element-type.service';

@Component({
  selector: 'jhi-element-type-update',
  templateUrl: './element-type-update.component.html',
})
export class ElementTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected elementTypeService: ElementTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ elementType }) => {
      this.updateForm(elementType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const elementType = this.createFromForm();
    if (elementType.id !== undefined) {
      this.subscribeToSaveResponse(this.elementTypeService.update(elementType));
    } else {
      this.subscribeToSaveResponse(this.elementTypeService.create(elementType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IElementType>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(elementType: IElementType): void {
    this.editForm.patchValue({
      id: elementType.id,
      name: elementType.name,
    });
  }

  protected createFromForm(): IElementType {
    return {
      ...new ElementType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
