jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FormSubmissionService } from '../service/form-submission.service';
import { IFormSubmission, FormSubmission } from '../form-submission.model';
import { IForm } from 'app/entities/form/form.model';
import { FormService } from 'app/entities/form/service/form.service';

import { FormSubmissionUpdateComponent } from './form-submission-update.component';

describe('Component Tests', () => {
  describe('FormSubmission Management Update Component', () => {
    let comp: FormSubmissionUpdateComponent;
    let fixture: ComponentFixture<FormSubmissionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let formSubmissionService: FormSubmissionService;
    let formService: FormService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormSubmissionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FormSubmissionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormSubmissionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      formSubmissionService = TestBed.inject(FormSubmissionService);
      formService = TestBed.inject(FormService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Form query and add missing value', () => {
        const formSubmission: IFormSubmission = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const formId: IForm = { id: '361f7b7e-2e1d-4b1d-accc-79b19c641d52' };
        formSubmission.formId = formId;

        const formCollection: IForm[] = [{ id: '7c55a970-1be4-4abc-bb8e-cb31fd930cfa' }];
        spyOn(formService, 'query').and.returnValue(of(new HttpResponse({ body: formCollection })));
        const additionalForms = [formId];
        const expectedCollection: IForm[] = [...additionalForms, ...formCollection];
        spyOn(formService, 'addFormToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ formSubmission });
        comp.ngOnInit();

        expect(formService.query).toHaveBeenCalled();
        expect(formService.addFormToCollectionIfMissing).toHaveBeenCalledWith(formCollection, ...additionalForms);
        expect(comp.formsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const formSubmission: IFormSubmission = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const formId: IForm = { id: '8e57cf0d-97bd-4673-971e-d6298475c7e7' };
        formSubmission.formId = formId;

        activatedRoute.data = of({ formSubmission });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(formSubmission));
        expect(comp.formsSharedCollection).toContain(formId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formSubmission = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formSubmissionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formSubmission });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: formSubmission }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(formSubmissionService.update).toHaveBeenCalledWith(formSubmission);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formSubmission = new FormSubmission();
        spyOn(formSubmissionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formSubmission });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: formSubmission }));
        saveSubject.complete();

        // THEN
        expect(formSubmissionService.create).toHaveBeenCalledWith(formSubmission);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formSubmission = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formSubmissionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formSubmission });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(formSubmissionService.update).toHaveBeenCalledWith(formSubmission);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFormById', () => {
        it('Should return tracked Form primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackFormById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
