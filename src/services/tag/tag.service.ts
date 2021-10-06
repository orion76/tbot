import { Injectable } from '@nestjs/common';
import { ITagService } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { TgMessageRepository } from '../../database/repositories/tg-message.repository';
import { TagRepository } from '../../database/repositories/tag.repository';
import { In } from 'typeorm';
import { IEntityTag } from '../../database/entities/types';


export const TAG_SERVICE = 'TAG_SERVICE';

@Injectable()
export class TagService implements ITagService {

  constructor(
    @InjectRepository(TagRepository) private tags: TagRepository,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository,
  ) {

  }

  searchTags(text: string): string[] {
    const reg = new RegExp('\#([^ ]+)', 'g');
    const result: string[] = Array.from(text.matchAll(reg)).map((arr: string[]) => arr[1]);
    return result.filter((value: string, index, self) => self.indexOf(value) === index);
  }

  async save(tags: string[]): Promise<IEntityTag[]> {
    const tags_exist = await this.findByTitle(tags);
    const tags_new = tags
      .filter((title) => !tags_exist[title])
      .map((title) => this.tags.create({title}))
    const saved = await this.tags.save(tags_new);

    return [...saved, ...Object.values(tags_exist)];
  }

  async findByTitle(tags: string[]): Promise<Record<string, IEntityTag>> {
    const tags_exists: IEntityTag[] = await this.tags.find({where: {title: In(tags)}});
    const map: Record<string, IEntityTag> = {};

    return tags_exists.reduce((acc, tag) => {
      acc[tag.title] = tag;
      return acc;
    }, map)

  }

}
