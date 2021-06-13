import { IFormSubmissionElement } from 'app/entities/form-submission-element/form-submission-element.model';
import { IForm } from 'app/entities/form/form.model';

export interface IFormSubmission {
  id?: string;
  formSubmissionElements?: IFormSubmissionElement[] | null;
  formId?: IForm | null;
}

export class FormSubmission implements IFormSubmission {
  constructor(public id?: string, public formSubmissionElements?: IFormSubmissionElement[] | null, public formId?: IForm | null) {}
}

export function getFormSubmissionIdentifier(formSubmission: IFormSubmission): string | undefined {
  return formSubmission.id;
}
