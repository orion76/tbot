import { Module } from '@nestjs/common';

export const APP_CONFIG = 'APP_CONFIG';

const getConfig = () => {
  return process.env.NODE_ENV === 'prod' ? require('../environment/prod') : require('../environment/dev')
}
export const appConfig = getConfig().config;

@Module({
  providers: [
    {provide: APP_CONFIG, useValue: appConfig}
  ],
  exports: [
    {provide: APP_CONFIG, useValue: appConfig}
  ]
})
export class AppConfigModule {
}
