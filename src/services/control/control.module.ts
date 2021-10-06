import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { CONTROL_SERVICE, ControlService } from './control.service';

@Module({
  imports: [
    LoggerModule,
  ],
  providers: [
    {provide: CONTROL_SERVICE, useClass: ControlService},
  ],
  exports: [
    {provide: CONTROL_SERVICE, useClass: ControlService},

  ],
})
export class ControlModule {
}
