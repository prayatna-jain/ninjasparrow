import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IElementType, getElementTypeIdentifier } from '../element-type.model';

export type EntityResponseType = HttpResponse<IElementType>;
export type EntityArrayResponseType = HttpResponse<IElementType[]>;

@Injectable({ providedIn: 'root' })
export class ElementTypeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/element-types');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(elementType: IElementType): Observable<EntityResponseType> {
    return this.http.post<IElementType>(this.resourceUrl, elementType, { observe: 'response' });
  }

  update(elementType: IElementType): Observable<EntityResponseType> {
    return this.http.put<IElementType>(`${this.resourceUrl}/${getElementTypeIdentifier(elementType) as string}`, elementType, {
      observe: 'response',
    });
  }

  partialUpdate(elementType: IElementType): Observable<EntityResponseType> {
    return this.http.patch<IElementType>(`${this.resourceUrl}/${getElementTypeIdentifier(elementType) as string}`, elementType, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IElementType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IElementType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addElementTypeToCollectionIfMissing(
    elementTypeCollection: IElementType[],
    ...elementTypesToCheck: (IElementType | null | undefined)[]
  ): IElementType[] {
    const elementTypes: IElementType[] = elementTypesToCheck.filter(isPresent);
    if (elementTypes.length > 0) {
      const elementTypeCollectionIdentifiers = elementTypeCollection.map(elementTypeItem => getElementTypeIdentifier(elementTypeItem)!);
      const elementTypesToAdd = elementTypes.filter(elementTypeItem => {
        const elementTypeIdentifier = getElementTypeIdentifier(elementTypeItem);
        if (elementTypeIdentifier == null || elementTypeCollectionIdentifiers.includes(elementTypeIdentifier)) {
          return false;
        }
        elementTypeCollectionIdentifiers.push(elementTypeIdentifier);
        return true;
      });
      return [...elementTypesToAdd, ...elementTypeCollection];
    }
    return elementTypeCollection;
  }
}
