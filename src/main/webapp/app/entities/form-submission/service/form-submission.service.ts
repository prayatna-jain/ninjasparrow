import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormSubmission, getFormSubmissionIdentifier } from '../form-submission.model';

export type EntityResponseType = HttpResponse<IFormSubmission>;
export type EntityArrayResponseType = HttpResponse<IFormSubmission[]>;

@Injectable({ providedIn: 'root' })
export class FormSubmissionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/form-submissions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(formSubmission: IFormSubmission): Observable<EntityResponseType> {
    return this.http.post<IFormSubmission>(this.resourceUrl, formSubmission, { observe: 'response' });
  }

  update(formSubmission: IFormSubmission): Observable<EntityResponseType> {
    return this.http.put<IFormSubmission>(`${this.resourceUrl}/${getFormSubmissionIdentifier(formSubmission) as string}`, formSubmission, {
      observe: 'response',
    });
  }

  partialUpdate(formSubmission: IFormSubmission): Observable<EntityResponseType> {
    return this.http.patch<IFormSubmission>(
      `${this.resourceUrl}/${getFormSubmissionIdentifier(formSubmission) as string}`,
      formSubmission,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IFormSubmission>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormSubmission[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFormSubmissionToCollectionIfMissing(
    formSubmissionCollection: IFormSubmission[],
    ...formSubmissionsToCheck: (IFormSubmission | null | undefined)[]
  ): IFormSubmission[] {
    const formSubmissions: IFormSubmission[] = formSubmissionsToCheck.filter(isPresent);
    if (formSubmissions.length > 0) {
      const formSubmissionCollectionIdentifiers = formSubmissionCollection.map(
        formSubmissionItem => getFormSubmissionIdentifier(formSubmissionItem)!
      );
      const formSubmissionsToAdd = formSubmissions.filter(formSubmissionItem => {
        const formSubmissionIdentifier = getFormSubmissionIdentifier(formSubmissionItem);
        if (formSubmissionIdentifier == null || formSubmissionCollectionIdentifiers.includes(formSubmissionIdentifier)) {
          return false;
        }
        formSubmissionCollectionIdentifiers.push(formSubmissionIdentifier);
        return true;
      });
      return [...formSubmissionsToAdd, ...formSubmissionCollection];
    }
    return formSubmissionCollection;
  }
}
