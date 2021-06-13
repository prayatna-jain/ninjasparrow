import { IForm } from 'app/entities/form/form.model';

export interface ILookupField {
  id?: string;
  formId?: string | null;
  elementId?: string | null;
  formId?: IForm | null;
}

export class LookupField implements ILookupField {
  constructor(public id?: string, public formId?: string | null, public elementId?: string | null, public formId?: IForm | null) {}
}

export function getLookupFieldIdentifier(lookupField: ILookupField): string | undefined {
  return lookupField.id;
}
