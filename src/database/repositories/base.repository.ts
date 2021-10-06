import { Repository } from 'typeorm';
import { IEntity } from '../entities/types';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export class BaseRepository<E extends IEntity> extends Repository<E> {
  
  async saveMultiple(entities: DeepPartial<E>[]): Promise<Map<number, E>> {

    const entities_map: Map<number, E> = new Map();
    const result: E[] = [];
    for (const item of entities) {
      try {
        let exist: E = await this.findOne(item.id);
        if (!exist) {
          exist = await this.saveOne(item);
        }
        result.push(exist);
      } catch (e) {
        let n = 0;
      }
    }
    result.forEach((item: E) => {
      item.id = Number(item.id);
      entities_map.set(item.id, item);
    });
    return entities_map;
  }

  saveOne(entity: DeepPartial<E>): Promise<E> {
    return this.save(entity) as Promise<E>
    // return saved;
  }
}
