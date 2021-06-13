jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LookupFieldService } from '../service/lookup-field.service';
import { ILookupField, LookupField } from '../lookup-field.model';
import { IForm } from 'app/entities/form/form.model';
import { FormService } from 'app/entities/form/service/form.service';

import { LookupFieldUpdateComponent } from './lookup-field-update.component';

describe('Component Tests', () => {
  describe('LookupField Management Update Component', () => {
    let comp: LookupFieldUpdateComponent;
    let fixture: ComponentFixture<LookupFieldUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let lookupFieldService: LookupFieldService;
    let formService: FormService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LookupFieldUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LookupFieldUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LookupFieldUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      lookupFieldService = TestBed.inject(LookupFieldService);
      formService = TestBed.inject(FormService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Form query and add missing value', () => {
        const lookupField: ILookupField = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const formId: IForm = { id: '8e76a77b-6ffe-4ea4-8989-0401a1ea3820' };
        lookupField.formId = formId;

        const formCollection: IForm[] = [{ id: '0b201994-7833-48ed-a8a1-e1f6bbb81e14' }];
        spyOn(formService, 'query').and.returnValue(of(new HttpResponse({ body: formCollection })));
        const additionalForms = [formId];
        const expectedCollection: IForm[] = [...additionalForms, ...formCollection];
        spyOn(formService, 'addFormToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ lookupField });
        comp.ngOnInit();

        expect(formService.query).toHaveBeenCalled();
        expect(formService.addFormToCollectionIfMissing).toHaveBeenCalledWith(formCollection, ...additionalForms);
        expect(comp.formsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const lookupField: ILookupField = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const formId: IForm = { id: '72066d8d-4bd6-4c87-8332-507651f12d84' };
        lookupField.formId = formId;

        activatedRoute.data = of({ lookupField });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(lookupField));
        expect(comp.formsSharedCollection).toContain(formId);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const lookupField = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(lookupFieldService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ lookupField });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: lookupField }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(lookupFieldService.update).toHaveBeenCalledWith(lookupField);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const lookupField = new LookupField();
        spyOn(lookupFieldService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ lookupField });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: lookupField }));
        saveSubject.complete();

        // THEN
        expect(lookupFieldService.create).toHaveBeenCalledWith(lookupField);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const lookupField = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(lookupFieldService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ lookupField });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(lookupFieldService.update).toHaveBeenCalledWith(lookupField);
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
