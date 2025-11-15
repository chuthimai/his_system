import { Module } from '@nestjs/common';

import { MessageService } from './messages.service';

@Module({
  imports: [],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
