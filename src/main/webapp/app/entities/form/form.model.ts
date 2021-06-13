import { IFormElement } from 'app/entities/form-element/form-element.model';
import { IFormSubmission } from 'app/entities/form-submission/form-submission.model';
import { ILookupField } from 'app/entities/lookup-field/lookup-field.model';

export interface IForm {
  id?: string;
  name?: string | null;
  formElements?: IFormElement[] | null;
  formSubmissions?: IFormSubmission[] | null;
  lookupFields?: ILookupField[] | null;
}

export class Form implements IForm {
  constructor(
    public id?: string,
    public name?: string | null,
    public formElements?: IFormElement[] | null,
    public formSubmissions?: IFormSubmission[] | null,
    public lookupFields?: ILookupField[] | null
  ) {}
}

export function getFormIdentifier(form: IForm): string | undefined {
  return form.id;
}
