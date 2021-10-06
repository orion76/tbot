export interface IReference<T> {
  type: string;
  entity: T;
}

export type TEntityReference<T> = T[];
export type TEntityReferences<T> = Map<string, TEntityReference<T>>
