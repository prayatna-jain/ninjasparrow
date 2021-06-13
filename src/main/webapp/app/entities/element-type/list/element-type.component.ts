import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IElementType } from '../element-type.model';
import { ElementTypeService } from '../service/element-type.service';
import { ElementTypeDeleteDialogComponent } from '../delete/element-type-delete-dialog.component';

@Component({
  selector: 'jhi-element-type',
  templateUrl: './element-type.component.html',
})
export class ElementTypeComponent implements OnInit {
  elementTypes?: IElementType[];
  isLoading = false;

  constructor(protected elementTypeService: ElementTypeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.elementTypeService.query().subscribe(
      (res: HttpResponse<IElementType[]>) => {
        this.isLoading = false;
        this.elementTypes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IElementType): string {
    return item.id!;
  }

  delete(elementType: IElementType): void {
    const modalRef = this.modalService.open(ElementTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.elementType = elementType;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
