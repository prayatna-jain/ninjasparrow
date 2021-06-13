jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FormElementService } from '../service/form-element.service';
import { IFormElement, FormElement } from '../form-element.model';
import { IElementType } from 'app/entities/element-type/element-type.model';
import { ElementTypeService } from 'app/entities/element-type/service/element-type.service';
import { ILookupField } from 'app/entities/lookup-field/lookup-field.model';
import { LookupFieldService } from 'app/entities/lookup-field/service/lookup-field.service';
import { IForm } from 'app/entities/form/form.model';
import { FormService } from 'app/entities/form/service/form.service';

import { FormElementUpdateComponent } from './form-element-update.component';

describe('Component Tests', () => {
  describe('FormElement Management Update Component', () => {
    let comp: FormElementUpdateComponent;
    let fixture: ComponentFixture<FormElementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let formElementService: FormElementService;
    let elementTypeService: ElementTypeService;
    let lookupFieldService: LookupFieldService;
    let formService: FormService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormElementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FormElementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormElementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      formElementService = TestBed.inject(FormElementService);
      elementTypeService = TestBed.inject(ElementTypeService);
      lookupFieldService = TestBed.inject(LookupFieldService);
      formService = TestBed.inject(FormService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call elementTypeId query and add missing value', () => {
        const formElement: IFormElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const elementTypeId: IElementType = { id: '4c2d014a-f3cd-40a4-94d9-ecefa5317c60' };
        formElement.elementTypeId = elementTypeId;

        const elementTypeIdCollection: IElementType[] = [{ id: '0763347d-39b6-48f9-aacc-a9152d909e71' }];
        spyOn(elementTypeService, 'query').and.returnValue(of(new HttpResponse({ body: elementTypeIdCollection })));
        const expectedCollection: IElementType[] = [elementTypeId, ...elementTypeIdCollection];
        spyOn(elementTypeService, 'addElementTypeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ formElement });
        comp.ngOnInit();

        expect(elementTypeService.query).toHaveBeenCalled();
        expect(elementTypeService.addElementTypeToCollectionIfMissing).toHaveBeenCalledWith(elementTypeIdCollection, elementTypeId);
        expect(comp.elementTypeIdsCollection).toEqual(expectedCollection);
      });

      it('Should call lookupFieldId query and add missing value', () => {
        const formElement: IFormElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const lookupFieldId: ILookupField = { id: '1fd134af-fb51-4093-8b1e-b114cab71635' };
        formElement.lookupFieldId = lookupFieldId;

        const lookupFieldIdCollection: ILookupField[] = [{ id: 'a9820855-4e8f-4a98-9905-8b04220f8902' }];
        spyOn(lookupFieldService, 'query').and.returnValue(of(new HttpResponse({ body: lookupFieldIdCollection })));
        const expectedCollection: ILookupField[] = [lookupFieldId, ...lookupFieldIdCollection];
        spyOn(lookupFieldService, 'addLookupFieldToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ formElement });
        comp.ngOnInit();

        expect(lookupFieldService.query).toHaveBeenCalled();
        expect(lookupFieldService.addLookupFieldToCollectionIfMissing).toHaveBeenCalledWith(lookupFieldIdCollection, lookupFieldId);
        expect(comp.lookupFieldIdsCollection).toEqual(expectedCollection);
      });

      it('Should call Form query and add missing value', () => {
        const formElement: IFormElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const formId: IForm = { id: 'f9165917-a2de-4af5-87fe-1f6ff7cf0860' };
        formElement.formId = formId;

        const formCollection: IForm[] = [{ id: '078ff243-a6ee-421a-aa6c-ae71745a3aaa' }];
        spyOn(formService, 'query').and.returnValue(of(new HttpResponse({ body: formCollection })));
        const additionalForms = [formId];
        const expectedCollection: IForm[] = [...additionalForms, ...formCollection];
        spyOn(formService, 'addFormToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ formElement });
        comp.ngOnInit();

        expect(formService.query).toHaveBeenCalled();
        expect(formService.addFormToCollectionIfMissing).toHaveBeenCalledWith(formCollection, ...additionalForms);
        expect(comp.formsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const formElement: IFormElement = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const elementTypeId: IElementType = { id: '023698c5-0f93-4931-abbc-d3ca0a2107c1' };
        formElement.elementTypeId = elementTypeId;
        const lookupFieldId: ILookupField = { id: '03f37ba8-c124-49a0-bdb2-24fd381e2ae4' };
        formElement.lookupFieldId = lookupFieldId;
        const formId: IForm = { id: 'a7529070-9e7d-4848-9490-79235599b0da' };
        formElement.formId = formId;

        activatedRoute.data = of({ formElement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(formElement));
        expect(comp.elementTypeIdsCollection).toContain(elementTypeId);
        expect(comp.lookupFieldIdsCollection).toContain(lookupFieldId);
        expect(comp.formsSharedCollection).toContain(formId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formElementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formElement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: formElement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(formElementService.update).toHaveBeenCalledWith(formElement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formElement = new FormElement();
        spyOn(formElementService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formElement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: formElement }));
        saveSubject.complete();

        // THEN
        expect(formElementService.create).toHaveBeenCalledWith(formElement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const formElement = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formElementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ formElement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(formElementService.update).toHaveBeenCalledWith(formElement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackElementTypeById', () => {
        it('Should return tracked ElementType primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackElementTypeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLookupFieldById', () => {
        it('Should return tracked LookupField primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackLookupFieldById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
