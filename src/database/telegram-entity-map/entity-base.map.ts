import { IReference } from '../types';
import { IEntityMessage } from '../entities/types';

export type TKeys<T> = { [key in keyof T]?: any };
export type TReferences<T> = Record<string, TKeys<T>>;

export abstract class EntityBaseMap<T extends Object> {
  abstract fields: TKeys<T>;
  abstract references: TReferences<T>;

  getValues(entity: T): Partial<T> {
    const values: Partial<T> = Object.create({});
    Object.keys(this.fields).forEach((field) => {
      if (entity[field] !== undefined) {
        values[field] = entity[field];
      }
    })
    return values;
  }


  getReferences<R>(type, message: IEntityMessage): IReference<R>[] {
    const references: IReference<R>[] = [];
    Object.keys(this.references[type]).forEach((ref_field) => {
      if (message[ref_field]) {
        references.push({type: ref_field, entity: message[ref_field]});
      }
    })
    return references;
  }
}
