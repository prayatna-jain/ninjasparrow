jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FormSubmissionElementService } from '../service/form-submission-element.service';
import { IFormSubmissionElement, FormSubmissionElement } from '../form-submission-element.model';
import { IFormElement } from 'app/entities/form-element/form-element.model';
import { FormElementService } from 'app/entities/form-element/service/form-element.service';
import { IFormSubmission } from 'app/entities/form-submission/form-submission.model';
import { FormSubmissionService } from 'app/entities/form-submission/service/form-submission.service';

import { FormSubmissionElementUpdateComponent } from './form-submission-element-update.component';

describe('Component Tests', () => {
  describe('FormSubmissionElement Management Update Component', () => {
    let comp: FormSubmissionElementUpdateComponent;
    let fixture: ComponentFixture<FormSubmissionElementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let formSubmissionElementService: FormSubmissionElementService;
    let formElementService: FormElementService;
    let formSubmissionService: FormSubmissionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormSubmissionElementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FormSubmissionElementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormSubmissionElementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      formSubmissionElementService = TestBed.inject(FormSubmissionElementService);
      formElementService = TestBed.inject(FormElementService);
      formSubmissionService = TestBed.inject(FormSubmissionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call FormElement query and add missing value', () => {
        const formSubmissionElement: IFormSubmissionElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const elementId: IFormElement = { id: '75a91dc9-87b1-41a1-9e27-9037e7a361fb' };
        formSubmissionElement.elementId = elementId;

        const formElementCollection: IFormElement[] = [{ id: '34d15355-4eaa-4c89-9da1-f416b4ffa009' }];
        spyOn(formElementService, 'query').and.returnValue(of(new HttpResponse({ body: formElementCollection })));
        const additionalFormElements = [elementId];
        const expectedCollection: IFormElement[] = [...additionalFormElements, ...formElementCollection];
        spyOn(formElementService, 'addFormElementToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ formSubmissionElement });
        comp.ngOnInit();

        expect(formElementService.query).toHaveBeenCalled();
        expect(formElementService.addFormElementToCollectionIfMissing).toHaveBeenCalledWith(
          formElementCollection,
          ...additionalFormElements
        );
        expect(comp.formElementsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call FormSubmission query and add missing value', () => {
        const formSubmissionElement: IFormSubmissionElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const formSubmissionId: IFormSubmission = { id: 'be5ba016-0d80-44c0-b27f-ee74bff937b2' };
        formSubmissionElement.formSubmissionId = formSubmissionId;

        const formSubmissionCollection: IFormSubmission[] = [{ id: '7e883fc8-23c0-4de7-8d9d-56d8cc15b412' }];
        spyOn(formSubmissionService, 'query').and.returnValue(of(new HttpResponse({ body: formSubmissionCollection })));
        const additionalFormSubmissions = [formSubmissionId];
        const expectedCollection: IFormSubmission[] = [...additionalFormSubmissions, ...formSubmissionCollection];
        spyOn(formSubmissionService, 'addFormSubmissionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ formSubmissionElement });
        comp.ngOnInit();

        expect(formSubmissionService.query).toHaveBeenCalled();
        expect(formSubmissionService.addFormSubmissionToCollectionIfMissing).toHaveBeenCalledWith(
          formSubmissionCollection,
          ...additionalFormSubmissions
        );
        expect(comp.formSubmissionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const formSubmissionElement: IFormSubmissionElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const elementId: IFormElement = { id: '73ab4353-67d2-4f31-818a-58c84564e183' };
        formSubmissionElement.elementId = elementId;
        const formSubmissionId: IFormSubmission = { id: 'c37db628-327b-4a28-890c-f021389a4de5' };
        formSubmissionElement.formSubmissionId = formSubmissionId;

        activatedRoute.data = of({ formSubmissionElement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(formSubmissionElement));
        expect(comp.formElementsSharedCollection).toContain(elementId);
        expect(comp.formSubmissionsSharedCollection).toContain(formSubmissionId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formSubmissionElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formSubmissionElementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formSubmissionElement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: formSubmissionElement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(formSubmissionElementService.update).toHaveBeenCalledWith(formSubmissionElement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formSubmissionElement = new FormSubmissionElement();
        spyOn(formSubmissionElementService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formSubmissionElement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: formSubmissionElement }));
        saveSubject.complete();

        // THEN
        expect(formSubmissionElementService.create).toHaveBeenCalledWith(formSubmissionElement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formSubmissionElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formSubmissionElementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formSubmissionElement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(formSubmissionElementService.update).toHaveBeenCalledWith(formSubmissionElement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFormElementById', () => {
        it('Should return tracked FormElement primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackFormElementById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackFormSubmissionById', () => {
        it('Should return tracked FormSubmission primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackFormSubmissionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
