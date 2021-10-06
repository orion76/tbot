import { EntityRepository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { BaseRepository } from './base.repository';
import { IEntityTag } from '../entities/types';

@EntityRepository(Tag)
export class TagRepository extends BaseRepository<IEntityTag> {

}
