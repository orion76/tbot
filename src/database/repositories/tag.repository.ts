import { EntityRepository, In } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { BaseRepository } from './base.repository';
import { IEntityTag } from '../entities/types';


@EntityRepository(Tag)
export class TagRepository extends BaseRepository<IEntityTag> {

  async findByName(names: string[]) {
    return this.find({where: {title: In(names)}});
  }

  async saveNew(names: string[]) {
    const exist = await this.findByName(names);

    const filterExist = (name) => -1 === exist.findIndex((tag) => tag.title === name);

    const names_new = names.filter(filterExist);
    const tags_new = names_new.map((name) => this.create({title: name}));
    await this.save(tags_new);

  }
}
