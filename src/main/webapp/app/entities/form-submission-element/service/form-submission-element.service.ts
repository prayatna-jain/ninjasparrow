import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormSubmissionElement, getFormSubmissionElementIdentifier } from '../form-submission-element.model';

export type EntityResponseType = HttpResponse<IFormSubmissionElement>;
export type EntityArrayResponseType = HttpResponse<IFormSubmissionElement[]>;

@Injectable({ providedIn: 'root' })
export class FormSubmissionElementService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/form-submission-elements');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(formSubmissionElement: IFormSubmissionElement): Observable<EntityResponseType> {
    return this.http.post<IFormSubmissionElement>(this.resourceUrl, formSubmissionElement, { observe: 'response' });
  }

  update(formSubmissionElement: IFormSubmissionElement): Observable<EntityResponseType> {
    return this.http.put<IFormSubmissionElement>(
      `${this.resourceUrl}/${getFormSubmissionElementIdentifier(formSubmissionElement) as string}`,
      formSubmissionElement,
      { observe: 'response' }
    );
  }

  partialUpdate(formSubmissionElement: IFormSubmissionElement): Observable<EntityResponseType> {
    return this.http.patch<IFormSubmissionElement>(
      `${this.resourceUrl}/${getFormSubmissionElementIdentifier(formSubmissionElement) as string}`,
      formSubmissionElement,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IFormSubmissionElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormSubmissionElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormSubmissionElementToCollectionIfMissing(
    formSubmissionElementCollection: IFormSubmissionElement[],
    ...formSubmissionElementsToCheck: (IFormSubmissionElement | null | undefined)[]
  ): IFormSubmissionElement[] {
    const formSubmissionElements: IFormSubmissionElement[] = formSubmissionElementsToCheck.filter(isPresent);
    if (formSubmissionElements.length > 0) {
      const formSubmissionElementCollectionIdentifiers = formSubmissionElementCollection.map(
        formSubmissionElementItem => getFormSubmissionElementIdentifier(formSubmissionElementItem)!
      );
      const formSubmissionElementsToAdd = formSubmissionElements.filter(formSubmissionElementItem => {
        const formSubmissionElementIdentifier = getFormSubmissionElementIdentifier(formSubmissionElementItem);
        if (
          formSubmissionElementIdentifier == null ||
          formSubmissionElementCollectionIdentifiers.includes(formSubmissionElementIdentifier)
        ) {
          return false;
        }
        formSubmissionElementCollectionIdentifiers.push(formSubmissionElementIdentifier);
        return true;
      });
      return [...formSubmissionElementsToAdd, ...formSubmissionElementCollection];
    }
    return formSubmissionElementCollection;
  }
}
