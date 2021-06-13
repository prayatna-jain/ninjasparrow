export interface IElementType {
  id?: string;
  name?: string | null;
}

export class ElementType implements IElementType {
  constructor(public id?: string, public name?: string | null) {}
}

export function getElementTypeIdentifier(elementType: IElementType): string | undefined {
  return elementType.id;
}
