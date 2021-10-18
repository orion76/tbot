import { IAppConfigFlood } from '../services/services.module';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Context } from 'telegraf';
import { Deunionize } from 'telegraf/src/deunionize';
import * as tg from 'telegraf/src/core/types/typegram';
import { IEntityMessage } from '../database/entities/types';


export interface IBotConfig {
  name: string;
  token: string;
}

export interface IAppConfig {
  bot: IBotConfig;
  chat_id: number,
  channel_id: number,
  reply_count: number,
  database: TypeOrmModuleOptions,
  flood: IAppConfigFlood,
}

export interface ISessionData {
  currentPage: number;
}


export interface IContext<T extends Deunionize<tg.Update> = tg.Update> extends Context<T> {
  session?: ISessionData;
  msg?:IEntityMessage;
}
