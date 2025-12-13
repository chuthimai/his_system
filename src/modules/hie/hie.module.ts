import { Module } from '@nestjs/common';

import { HieService } from './hie.service';

@Module({
  imports: [],
  providers: [HieService],
  exports: [HieService],
})
export class HieModule {}
