import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ChanelPostModule } from './chanel-post/chanel-post.module';
import { LoggerModule } from './logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IContext } from './types/types';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { MessageSaveMiddleware } from './middlewares/message-save.middleware';
import { DatabaseModule } from './database/database.module';
import { ControlModule } from './services/control/control.module';
import { MessageModule } from './services/message/message.module';
import { TagModule } from './services/tag/tag.module';
import { IMessageHandler } from './middlewares/types';
import { SafeThreadHandler } from './middlewares/save-thread.handler';
import { AppConfigModule } from './app-config.module';
import { SafeTagHandler } from './middlewares/save-tag.handler';

const getConfig = () => {
  return process.env.NODE_ENV === 'prod' ? require('../environment/prod') : require('../environment/dev')
}
export const appConfig = getConfig().config;
export const BOT_NAME = appConfig.bot.name;


console.log('ENV:', process.env.NODE_ENV);
console.log('[appConfig]\n', appConfig);

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    DatabaseModule,
    ControlModule,
    MessageModule,
    TagModule,
    TelegrafModule.forRootAsync({
      imports: [MiddlewaresModule],
      useFactory: (saveMessage: MessageSaveMiddleware, ...handlers: IMessageHandler[]) => ({
        botName: appConfig.bot.name,
        token: appConfig.bot.token,
        middlewares: [
          (ctx: IContext<any>, next: any) => {
            console.log('START');
            // console.log('START',JSON.stringify(Array.from(Object.keys(ctx.update))));
            // console.log('START',JSON.stringify(ctx.update.callback_query,null,2));
            next(ctx);
          },
          // (new LocalSession({database: 'example_db.json', property: 'session'})).middleware(),
          saveMessage.middleware(handlers)
        ],
        include: [
          ChanelPostModule,
        ],
      }),
      inject: [
        MessageSaveMiddleware,
        SafeThreadHandler,
        SafeTagHandler
      ]
    }),
    TypeOrmModule.forRootAsync({useFactory: () => appConfig.database}),
    // DatabaseModule,
    ChanelPostModule,
  ],

  providers: [
    MessageSaveMiddleware,
    SafeThreadHandler
  ],
  exports: [
    MessageSaveMiddleware,
  ]
  // controllers: [AppController],

})
export class AppModule {
}

