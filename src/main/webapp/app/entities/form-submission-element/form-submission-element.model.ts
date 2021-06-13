import { IFormElement } from 'app/entities/form-element/form-element.model';
import { IFormSubmission } from 'app/entities/form-submission/form-submission.model';

export interface IFormSubmissionElement {
  id?: string;
  value?: string | null;
  elementId?: IFormElement | null;
  formSubmissionId?: IFormSubmission | null;
}

export class FormSubmissionElement implements IFormSubmissionElement {
  constructor(
    public id?: string,
    public value?: string | null,
    public elementId?: IFormElement | null,
    public formSubmissionId?: IFormSubmission | null
  ) {}
}

export function getFormSubmissionElementIdentifier(formSubmissionElement: IFormSubmissionElement): string | undefined {
  return formSubmissionElement.id;
}
