import { Module } from '@nestjs/common';

import { EthersService } from './ethers.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EthersService],
  exports: [EthersService],
})
export class EthersModule {}
