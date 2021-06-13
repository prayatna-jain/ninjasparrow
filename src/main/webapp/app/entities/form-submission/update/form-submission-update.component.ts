import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFormSubmission, FormSubmission } from '../form-submission.model';
import { FormSubmissionService } from '../service/form-submission.service';
import { IForm } from 'app/entities/form/form.model';
import { FormService } from 'app/entities/form/service/form.service';

@Component({
  selector: 'jhi-form-submission-update',
  templateUrl: './form-submission-update.component.html',
})
export class FormSubmissionUpdateComponent implements OnInit {
  isSaving = false;

  formsSharedCollection: IForm[] = [];

  editForm = this.fb.group({
    id: [],
    formId: [],
    formId: [],
  });

  constructor(
    protected formSubmissionService: FormSubmissionService,
    protected formService: FormService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formSubmission }) => {
      this.updateForm(formSubmission);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formSubmission = this.createFromForm();
    if (formSubmission.id !== undefined) {
      this.subscribeToSaveResponse(this.formSubmissionService.update(formSubmission));
    } else {
      this.subscribeToSaveResponse(this.formSubmissionService.create(formSubmission));
    }
  }

  trackFormById(index: number, item: IForm): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormSubmission>>): void {
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

  protected updateForm(formSubmission: IFormSubmission): void {
    this.editForm.patchValue({
      id: formSubmission.id,
      formId: formSubmission.formId,
      formId: formSubmission.formId,
    });

    this.formsSharedCollection = this.formService.addFormToCollectionIfMissing(this.formsSharedCollection, formSubmission.formId);
  }

  protected loadRelationshipsOptions(): void {
    this.formService
      .query()
      .pipe(map((res: HttpResponse<IForm[]>) => res.body ?? []))
      .pipe(map((forms: IForm[]) => this.formService.addFormToCollectionIfMissing(forms, this.editForm.get('formId')!.value)))
      .subscribe((forms: IForm[]) => (this.formsSharedCollection = forms));
  }

  protected createFromForm(): IFormSubmission {
    return {
      ...new FormSubmission(),
      id: this.editForm.get(['id'])!.value,
      formId: this.editForm.get(['formId'])!.value,
      formId: this.editForm.get(['formId'])!.value,
    };
  }
}
