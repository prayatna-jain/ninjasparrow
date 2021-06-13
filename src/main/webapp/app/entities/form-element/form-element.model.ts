import { IElementType } from 'app/entities/element-type/element-type.model';
import { ILookupField } from 'app/entities/lookup-field/lookup-field.model';
import { IFormSubmissionElement } from 'app/entities/form-submission-element/form-submission-element.model';
import { IForm } from 'app/entities/form/form.model';

export interface IFormElement {
  id?: string;
  name?: string | null;
  formId?: string | null;
  elementTypeId?: string | null;
  lookupFieldId?: string | null;
  elementTypeId?: IElementType | null;
  lookupFieldId?: ILookupField | null;
  formSubmissionElements?: IFormSubmissionElement[] | null;
  formId?: IForm | null;
}

export class FormElement implements IFormElement {
  constructor(
    public id?: string,
    public name?: string | null,
    public formId?: string | null,
    public elementTypeId?: string | null,
    public lookupFieldId?: string | null,
    public elementTypeId?: IElementType | null,
    public lookupFieldId?: ILookupField | null,
    public formSubmissionElements?: IFormSubmissionElement[] | null,
    public formId?: IForm | null
  ) {}
}

export function getFormElementIdentifier(formElement: IFormElement): string | undefined {
  return formElement.id;
}
