import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ElementTypeComponent } from './list/element-type.component';
import { ElementTypeDetailComponent } from './detail/element-type-detail.component';
import { ElementTypeUpdateComponent } from './update/element-type-update.component';
import { ElementTypeDeleteDialogComponent } from './delete/element-type-delete-dialog.component';
import { ElementTypeRoutingModule } from './route/element-type-routing.module';

@NgModule({
  imports: [SharedModule, ElementTypeRoutingModule],
  declarations: [ElementTypeComponent, ElementTypeDetailComponent, ElementTypeUpdateComponent, ElementTypeDeleteDialogComponent],
  entryComponents: [ElementTypeDeleteDialogComponent],
})
export class ElementTypeModule {}
