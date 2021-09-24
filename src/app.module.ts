import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ChanelPostModule } from './chanel-post/chanel-post.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

const getConfig = () => {
  return process.env.NODE_ENV === 'dev' ? require('../environment/dev') : require('../environment/prod')
}
export const appConfig = getConfig().config;
export const BOT_NAME = appConfig.bot.name;


 console.log('ENV:', process.env.NODE_ENV);
 console.log('[appConfig]\n', appConfig);

@Module({
  imports: [
    LoggerModule,
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        botName: appConfig.bot.name,
        token: appConfig.bot.token,
        // middlewares: [sessionMiddleware],
        include: [ChanelPostModule],
      }),
      inject: []
    }),
    DatabaseModule,
    ChanelPostModule,
  ],
  providers: [],
  exports: []
  // controllers: [AppController],

})
export class AppModule {
}

