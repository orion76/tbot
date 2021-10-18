import { IActionResponse, TActions } from '../services/types';
import { Base64 } from './base64';

export enum EAction {
  VIEW = 0
}

export enum EActionViewType {
  TAG = 0
}

export class ActionResponse {

  static decodeViewTag(tag: string, page: number, message_id?: number) {
    const data = [EAction.VIEW, EActionViewType.TAG, tag, page];
    if (message_id) {
      data.push(message_id);
    }
    return Base64.to(data.map(String));
  }

  static encodeViewTag(data: string[]) {
    const [tag, page, message_id] = data;
    return {tag, page, message_id};
  }

  static encode(base64: string): IActionResponse {
    const data = Base64.from(base64);
    const action: TActions = data.shift();
    const type: string = data.shift();
    return {action, type, data}
  }
}
