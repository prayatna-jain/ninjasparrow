jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FormService } from '../service/form.service';
import { IForm, Form } from '../form.model';

import { FormUpdateComponent } from './form-update.component';

describe('Component Tests', () => {
  describe('Form Management Update Component', () => {
    let comp: FormUpdateComponent;
    let fixture: ComponentFixture<FormUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let formService: FormService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FormUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      formService = TestBed.inject(FormService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const form: IForm = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        activatedRoute.data = of({ form });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(form));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const form = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ form });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: form }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(formService.update).toHaveBeenCalledWith(form);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const form = new Form();
        spyOn(formService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ form });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: form }));
        saveSubject.complete();

        // THEN
        expect(formService.create).toHaveBeenCalledWith(form);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const form = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(formService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ form });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(formService.update).toHaveBeenCalledWith(form);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
