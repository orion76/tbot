import { EntityBaseMap } from './entity-base.map';
import { IEntityMessage } from '../entities/types';

export class MessageMap extends EntityBaseMap<IEntityMessage> {
  fields = {
    message_id: true,
    chat: true,
    from: true,
    text: true,
    date: true,
  };

  references = {
    message: {
      reply_to_message: true
    },
    user: {
      from: true
    },
    chat: {
      chat: true,
      sender_chat: true
    }
  }

}
