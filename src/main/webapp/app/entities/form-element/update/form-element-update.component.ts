import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFormElement, FormElement } from '../form-element.model';
import { FormElementService } from '../service/form-element.service';
import { IElementType } from 'app/entities/element-type/element-type.model';
import { ElementTypeService } from 'app/entities/element-type/service/element-type.service';
import { ILookupField } from 'app/entities/lookup-field/lookup-field.model';
import { LookupFieldService } from 'app/entities/lookup-field/service/lookup-field.service';
import { IForm } from 'app/entities/form/form.model';
import { FormService } from 'app/entities/form/service/form.service';

@Component({
  selector: 'jhi-form-element-update',
  templateUrl: './form-element-update.component.html',
})
export class FormElementUpdateComponent implements OnInit {
  isSaving = false;

  elementTypeIdsCollection: IElementType[] = [];
  lookupFieldIdsCollection: ILookupField[] = [];
  formsSharedCollection: IForm[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    formId: [],
    elementTypeId: [],
    lookupFieldId: [],
    elementTypeId: [],
    lookupFieldId: [],
    formId: [],
  });

  constructor(
    protected formElementService: FormElementService,
    protected elementTypeService: ElementTypeService,
    protected lookupFieldService: LookupFieldService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formElement }) => {
      this.updateForm(formElement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formElement = this.createFromForm();
    if (formElement.id !== undefined) {
      this.subscribeToSaveResponse(this.formElementService.update(formElement));
    } else {
      this.subscribeToSaveResponse(this.formElementService.create(formElement));
    }
  }

  trackElementTypeById(index: number, item: IElementType): string {
    return item.id!;
  }

  trackLookupFieldById(index: number, item: ILookupField): string {
    return item.id!;
  }

  trackFormById(index: number, item: IForm): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormElement>>): void {
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

  protected updateForm(formElement: IFormElement): void {
    this.editForm.patchValue({
      id: formElement.id,
      name: formElement.name,
      formId: formElement.formId,
      elementTypeId: formElement.elementTypeId,
      lookupFieldId: formElement.lookupFieldId,
      elementTypeId: formElement.elementTypeId,
      lookupFieldId: formElement.lookupFieldId,
      formId: formElement.formId,
    });

    this.elementTypeIdsCollection = this.elementTypeService.addElementTypeToCollectionIfMissing(
      this.elementTypeIdsCollection,
      formElement.elementTypeId
    );
    this.lookupFieldIdsCollection = this.lookupFieldService.addLookupFieldToCollectionIfMissing(
      this.lookupFieldIdsCollection,
      formElement.lookupFieldId
    );
    this.formsSharedCollection = this.formService.addFormToCollectionIfMissing(this.formsSharedCollection, formElement.formId);
  }

  protected loadRelationshipsOptions(): void {
    this.elementTypeService
      .query({ filter: 'formelement-is-null' })
      .pipe(map((res: HttpResponse<IElementType[]>) => res.body ?? []))
      .pipe(
        map((elementTypes: IElementType[]) =>
          this.elementTypeService.addElementTypeToCollectionIfMissing(elementTypes, this.editForm.get('elementTypeId')!.value)
        )
      )
      .subscribe((elementTypes: IElementType[]) => (this.elementTypeIdsCollection = elementTypes));

    this.lookupFieldService
      .query({ filter: 'formelement-is-null' })
      .pipe(map((res: HttpResponse<ILookupField[]>) => res.body ?? []))
      .pipe(
        map((lookupFields: ILookupField[]) =>
          this.lookupFieldService.addLookupFieldToCollectionIfMissing(lookupFields, this.editForm.get('lookupFieldId')!.value)
        )
      )
      .subscribe((lookupFields: ILookupField[]) => (this.lookupFieldIdsCollection = lookupFields));

    this.formService
      .query()
      .pipe(map((res: HttpResponse<IForm[]>) => res.body ?? []))
      .pipe(map((forms: IForm[]) => this.formService.addFormToCollectionIfMissing(forms, this.editForm.get('formId')!.value)))
      .subscribe((forms: IForm[]) => (this.formsSharedCollection = forms));
  }

  protected createFromForm(): IFormElement {
    return {
      ...new FormElement(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      formId: this.editForm.get(['formId'])!.value,
      elementTypeId: this.editForm.get(['elementTypeId'])!.value,
      lookupFieldId: this.editForm.get(['lookupFieldId'])!.value,
      elementTypeId: this.editForm.get(['elementTypeId'])!.value,
      lookupFieldId: this.editForm.get(['lookupFieldId'])!.value,
      formId: this.editForm.get(['formId'])!.value,
    };
  }
}
