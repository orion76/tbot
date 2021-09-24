import { SequelizeOptions } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize-options';
import { IAppConfigFlood } from '../services/services.module';


export interface IBotConfig {
  name: string;
  token: string;
}

export interface IAppConfig {
  bot: IBotConfig;
  chat_id: number,
  channel_id: number,
  reply_count: number,
  database: SequelizeOptions,
  flood: IAppConfigFlood
}

