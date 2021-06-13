import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FormElementComponent } from './list/form-element.component';
import { FormElementDetailComponent } from './detail/form-element-detail.component';
import { FormElementUpdateComponent } from './update/form-element-update.component';
import { FormElementDeleteDialogComponent } from './delete/form-element-delete-dialog.component';
import { FormElementRoutingModule } from './route/form-element-routing.module';

@NgModule({
  imports: [SharedModule, FormElementRoutingModule],
  declarations: [FormElementComponent, FormElementDetailComponent, FormElementUpdateComponent, FormElementDeleteDialogComponent],
  entryComponents: [FormElementDeleteDialogComponent],
})
export class FormElementModule {}
