jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ElementTypeService } from '../service/element-type.service';
import { IElementType, ElementType } from '../element-type.model';

import { ElementTypeUpdateComponent } from './element-type-update.component';

describe('Component Tests', () => {
  describe('ElementType Management Update Component', () => {
    let comp: ElementTypeUpdateComponent;
    let fixture: ComponentFixture<ElementTypeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let elementTypeService: ElementTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ElementTypeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ElementTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ElementTypeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      elementTypeService = TestBed.inject(ElementTypeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const elementType: IElementType = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        activatedRoute.data = of({ elementType });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(elementType));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const elementType = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(elementTypeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ elementType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: elementType }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(elementTypeService.update).toHaveBeenCalledWith(elementType);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const elementType = new ElementType();
        spyOn(elementTypeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ elementType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: elementType }));
        saveSubject.complete();

        // THEN
        expect(elementTypeService.create).toHaveBeenCalledWith(elementType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const elementType = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(elementTypeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ elementType });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(elementTypeService.update).toHaveBeenCalledWith(elementType);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
