import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILookupField, getLookupFieldIdentifier } from '../lookup-field.model';

export type EntityResponseType = HttpResponse<ILookupField>;
export type EntityArrayResponseType = HttpResponse<ILookupField[]>;

@Injectable({ providedIn: 'root' })
export class LookupFieldService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/lookup-fields');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(lookupField: ILookupField): Observable<EntityResponseType> {
    return this.http.post<ILookupField>(this.resourceUrl, lookupField, { observe: 'response' });
  }

  update(lookupField: ILookupField): Observable<EntityResponseType> {
    return this.http.put<ILookupField>(`${this.resourceUrl}/${getLookupFieldIdentifier(lookupField) as string}`, lookupField, {
      observe: 'response',
    });
  }

  partialUpdate(lookupField: ILookupField): Observable<EntityResponseType> {
    return this.http.patch<ILookupField>(`${this.resourceUrl}/${getLookupFieldIdentifier(lookupField) as string}`, lookupField, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ILookupField>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILookupField[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLookupFieldToCollectionIfMissing(
    lookupFieldCollection: ILookupField[],
    ...lookupFieldsToCheck: (ILookupField | null | undefined)[]
  ): ILookupField[] {
    const lookupFields: ILookupField[] = lookupFieldsToCheck.filter(isPresent);
    if (lookupFields.length > 0) {
      const lookupFieldCollectionIdentifiers = lookupFieldCollection.map(lookupFieldItem => getLookupFieldIdentifier(lookupFieldItem)!);
      const lookupFieldsToAdd = lookupFields.filter(lookupFieldItem => {
        const lookupFieldIdentifier = getLookupFieldIdentifier(lookupFieldItem);
        if (lookupFieldIdentifier == null || lookupFieldCollectionIdentifiers.includes(lookupFieldIdentifier)) {
          return false;
        }
        lookupFieldCollectionIdentifiers.push(lookupFieldIdentifier);
        return true;
      });
      return [...lookupFieldsToAdd, ...lookupFieldCollection];
    }
    return lookupFieldCollection;
  }
}
