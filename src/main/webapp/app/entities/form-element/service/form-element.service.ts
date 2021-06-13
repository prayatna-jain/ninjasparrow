import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormElement, getFormElementIdentifier } from '../form-element.model';

export type EntityResponseType = HttpResponse<IFormElement>;
export type EntityArrayResponseType = HttpResponse<IFormElement[]>;

@Injectable({ providedIn: 'root' })
export class FormElementService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/form-elements');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(formElement: IFormElement): Observable<EntityResponseType> {
    return this.http.post<IFormElement>(this.resourceUrl, formElement, { observe: 'response' });
  }

  update(formElement: IFormElement): Observable<EntityResponseType> {
    return this.http.put<IFormElement>(`${this.resourceUrl}/${getFormElementIdentifier(formElement) as string}`, formElement, {
      observe: 'response',
    });
  }

  partialUpdate(formElement: IFormElement): Observable<EntityResponseType> {
    return this.http.patch<IFormElement>(`${this.resourceUrl}/${getFormElementIdentifier(formElement) as string}`, formElement, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IFormElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormElementToCollectionIfMissing(
    formElementCollection: IFormElement[],
    ...formElementsToCheck: (IFormElement | null | undefined)[]
  ): IFormElement[] {
    const formElements: IFormElement[] = formElementsToCheck.filter(isPresent);
    if (formElements.length > 0) {
      const formElementCollectionIdentifiers = formElementCollection.map(formElementItem => getFormElementIdentifier(formElementItem)!);
      const formElementsToAdd = formElements.filter(formElementItem => {
        const formElementIdentifier = getFormElementIdentifier(formElementItem);
        if (formElementIdentifier == null || formElementCollectionIdentifiers.includes(formElementIdentifier)) {
          return false;
        }
        formElementCollectionIdentifiers.push(formElementIdentifier);
        return true;
      });
      return [...formElementsToAdd, ...formElementCollection];
    }
    return formElementCollection;
  }
}
