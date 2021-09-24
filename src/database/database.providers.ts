import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from 'src/app.constants';
import { TgMessage } from './models/tg-message.model';
import { TgUser } from './models/tg-user.model';
import { TgChat } from './models/tg-chat.model';
import { appConfig } from '../app.module';



const models = [
  TgMessage,
  TgUser,
  TgChat
];

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize(appConfig.database);
      sequelize.addModels(models);
      await sequelize.sync();

      return sequelize;
    },
  },
];
