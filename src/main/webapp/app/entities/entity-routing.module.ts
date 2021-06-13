import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'form',
        data: { pageTitle: 'Forms' },
        loadChildren: () => import('./form/form.module').then(m => m.FormModule),
      },
      {
        path: 'form-element',
        data: { pageTitle: 'FormElements' },
        loadChildren: () => import('./form-element/form-element.module').then(m => m.FormElementModule),
      },
      {
        path: 'element-type',
        data: { pageTitle: 'ElementTypes' },
        loadChildren: () => import('./element-type/element-type.module').then(m => m.ElementTypeModule),
      },
      {
        path: 'form-submission',
        data: { pageTitle: 'FormSubmissions' },
        loadChildren: () => import('./form-submission/form-submission.module').then(m => m.FormSubmissionModule),
      },
      {
        path: 'form-submission-element',
        data: { pageTitle: 'FormSubmissionElements' },
        loadChildren: () => import('./form-submission-element/form-submission-element.module').then(m => m.FormSubmissionElementModule),
      },
      {
        path: 'lookup-field',
        data: { pageTitle: 'LookupFields' },
        loadChildren: () => import('./lookup-field/lookup-field.module').then(m => m.LookupFieldModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
