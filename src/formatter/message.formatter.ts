import { IEntityMessage, IEntityUser } from '../database/entities/types';

// @link  https://apps.timwhitlock.info/emoji/tables/unicode#block-3-transport-and-map-symbols
export enum ESmiles {
  info = '\u2139',
  clock = '\u23F0',
  high_voltage_sign = '\u26A1',
  star = '\u2B50',
  arrow_right = '\u27A1',
  arrow_left = '\u2B05',
  arrow_top = '\u2B06',
  arrow_bottom = '\u2B07',
}

export class MessageFormatter {
  static anons(message: IEntityMessage): string {
    const output = [];
    const url = MessageFormatter.messageUrl(message);
    output.push(`${ESmiles.info}  ` + MessageFormatter.bold(message.title));
    output.push('-----------------------');

    output.push(message.text.substring(0, 200));
    output.push('');
    output.push(MessageFormatter.link(url, 'Подробнее'));
    output.push('-----------------------');
    output.push('');

    return output.join('\n');
  }

  static messageUrl(message: IEntityMessage) {
    return `https://t.me/${message.chat.username}/${message.message_id}`;
  }

  static link(url: string, title: string) {
    return `<a href="${url}">${title}</a>`;
  }


  static bold(text: string) {
    // return text;
    return `<b>${text}</b>`;
  }

  static author(author: IEntityUser) {
    return `Автор: @${author.title}`;
  }

}
