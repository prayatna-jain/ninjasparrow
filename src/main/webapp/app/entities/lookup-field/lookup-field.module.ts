import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LookupFieldComponent } from './list/lookup-field.component';
import { LookupFieldDetailComponent } from './detail/lookup-field-detail.component';
import { LookupFieldUpdateComponent } from './update/lookup-field-update.component';
import { LookupFieldDeleteDialogComponent } from './delete/lookup-field-delete-dialog.component';
import { LookupFieldRoutingModule } from './route/lookup-field-routing.module';

@NgModule({
  imports: [SharedModule, LookupFieldRoutingModule],
  declarations: [LookupFieldComponent, LookupFieldDetailComponent, LookupFieldUpdateComponent, LookupFieldDeleteDialogComponent],
  entryComponents: [LookupFieldDeleteDialogComponent],
})
export class LookupFieldModule {}
