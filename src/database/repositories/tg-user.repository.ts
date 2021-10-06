import { EntityRepository } from 'typeorm';
import { TgUser } from '../entities/tg-user.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(TgUser)
export class TgUserRepository extends BaseRepository<TgUser> {
  
  
}
