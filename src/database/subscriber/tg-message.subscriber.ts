import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { IEntityMessage } from '../entities/types';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<IEntityMessage> {

}
