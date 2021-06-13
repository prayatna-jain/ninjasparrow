import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFormSubmissionElement, FormSubmissionElement } from '../form-submission-element.model';
import { FormSubmissionElementService } from '../service/form-submission-element.service';
import { IFormElement } from 'app/entities/form-element/form-element.model';
import { FormElementService } from 'app/entities/form-element/service/form-element.service';
import { IFormSubmission } from 'app/entities/form-submission/form-submission.model';
import { FormSubmissionService } from 'app/entities/form-submission/service/form-submission.service';

@Component({
  selector: 'jhi-form-submission-element-update',
  templateUrl: './form-submission-element-update.component.html',
})
export class FormSubmissionElementUpdateComponent implements OnInit {
  isSaving = false;

  formElementsSharedCollection: IFormElement[] = [];
  formSubmissionsSharedCollection: IFormSubmission[] = [];

  editForm = this.fb.group({
    id: [],
    value: [],
    elementId: [],
    formSubmissionId: [],
  });

  constructor(
    protected formSubmissionElementService: FormSubmissionElementService,
    protected formElementService: FormElementService,
    protected formSubmissionService: FormSubmissionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formSubmissionElement }) => {
      this.updateForm(formSubmissionElement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formSubmissionElement = this.createFromForm();
    if (formSubmissionElement.id !== undefined) {
      this.subscribeToSaveResponse(this.formSubmissionElementService.update(formSubmissionElement));
    } else {
      this.subscribeToSaveResponse(this.formSubmissionElementService.create(formSubmissionElement));
    }
  }

  trackFormElementById(index: number, item: IFormElement): string {
    return item.id!;
  }

  trackFormSubmissionById(index: number, item: IFormSubmission): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormSubmissionElement>>): void {
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

  protected updateForm(formSubmissionElement: IFormSubmissionElement): void {
    this.editForm.patchValue({
      id: formSubmissionElement.id,
      value: formSubmissionElement.value,
      elementId: formSubmissionElement.elementId,
      formSubmissionId: formSubmissionElement.formSubmissionId,
    });

    this.formElementsSharedCollection = this.formElementService.addFormElementToCollectionIfMissing(
      this.formElementsSharedCollection,
      formSubmissionElement.elementId
    );
    this.formSubmissionsSharedCollection = this.formSubmissionService.addFormSubmissionToCollectionIfMissing(
      this.formSubmissionsSharedCollection,
      formSubmissionElement.formSubmissionId
    );
  }

  protected loadRelationshipsOptions(): void {
    this.formElementService
      .query()
      .pipe(map((res: HttpResponse<IFormElement[]>) => res.body ?? []))
      .pipe(
        map((formElements: IFormElement[]) =>
          this.formElementService.addFormElementToCollectionIfMissing(formElements, this.editForm.get('elementId')!.value)
        )
      )
      .subscribe((formElements: IFormElement[]) => (this.formElementsSharedCollection = formElements));

    this.formSubmissionService
      .query()
      .pipe(map((res: HttpResponse<IFormSubmission[]>) => res.body ?? []))
      .pipe(
        map((formSubmissions: IFormSubmission[]) =>
          this.formSubmissionService.addFormSubmissionToCollectionIfMissing(formSubmissions, this.editForm.get('formSubmissionId')!.value)
        )
      )
      .subscribe((formSubmissions: IFormSubmission[]) => (this.formSubmissionsSharedCollection = formSubmissions));
  }

  protected createFromForm(): IFormSubmissionElement {
    return {
      ...new FormSubmissionElement(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
      elementId: this.editForm.get(['elementId'])!.value,
      formSubmissionId: this.editForm.get(['formSubmissionId'])!.value,
    };
  }
}
