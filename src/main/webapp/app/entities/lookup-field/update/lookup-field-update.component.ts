import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILookupField, LookupField } from '../lookup-field.model';
import { LookupFieldService } from '../service/lookup-field.service';
import { IForm } from 'app/entities/form/form.model';
import { FormService } from 'app/entities/form/service/form.service';

@Component({
  selector: 'jhi-lookup-field-update',
  templateUrl: './lookup-field-update.component.html',
})
export class LookupFieldUpdateComponent implements OnInit {
  isSaving = false;

  formsSharedCollection: IForm[] = [];

  editForm = this.fb.group({
    id: [],
    formId: [],
  });

  constructor(
    protected lookupFieldService: LookupFieldService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lookupField }) => {
      this.updateForm(lookupField);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lookupField = this.createFromForm();
    if (lookupField.id !== undefined) {
      this.subscribeToSaveResponse(this.lookupFieldService.update(lookupField));
    } else {
      this.subscribeToSaveResponse(this.lookupFieldService.create(lookupField));
    }
  }

  trackFormById(index: number, item: IForm): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILookupField>>): void {
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

  protected updateForm(lookupField: ILookupField): void {
    this.editForm.patchValue({
      id: lookupField.id,
      formId: lookupField.formId,
    });

    this.formsSharedCollection = this.formService.addFormToCollectionIfMissing(this.formsSharedCollection, lookupField.formId);
  }

  protected loadRelationshipsOptions(): void {
    this.formService
      .query()
      .pipe(map((res: HttpResponse<IForm[]>) => res.body ?? []))
      .pipe(map((forms: IForm[]) => this.formService.addFormToCollectionIfMissing(forms, this.editForm.get('formId')!.value)))
      .subscribe((forms: IForm[]) => (this.formsSharedCollection = forms));
  }

  protected createFromForm(): ILookupField {
    return {
      ...new LookupField(),
      id: this.editForm.get(['id'])!.value,
      formId: this.editForm.get(['formId'])!.value,
    };
  }
}
