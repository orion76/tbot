import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TgMessageRepository } from '../database/repositories/tg-message.repository';
import { IMessageHandler } from './types';
import { Context } from 'telegraf';
import { IEntityMessage } from '../database/entities/types';
import { MESSAGE_SERVICE } from '../services/message/message.service';
import { IMessageService } from '../services/types';
import { APP_CONFIG } from '../app-config.module';
import { IAppConfig } from '../types/types';
import { TagRepository } from '../database/repositories/tag.repository';


@Injectable()
export class SafeTagHandler implements IMessageHandler {

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    @InjectRepository(TgMessageRepository) private messages: TgMessageRepository,
    @InjectRepository(TagRepository) private tags: TagRepository,
    @Inject(MESSAGE_SERVICE) private messageService: IMessageService,
  ) {

  }

  async handle(ctx: Context<any>, message: IEntityMessage) {


    const names = this.getTags(message.text);
    if (names.length > 0) {
      await this.tags.saveNew(names);
    }
    message.tags = await this.tags.findByName(names);
    await this.messages.save(message);
  }

  /**
   * /#(\w)+/g.exec('word1  #tag1 word1 #tag2 word1  #tag3 word1')
   *
   * @param text
   */

  getTags(text: string) {
    const tags = text.match(/#(\w+)/g);
    return tags ? [...new Set(tags.map((tag) => tag.slice(1)))] : [];
  }

}
