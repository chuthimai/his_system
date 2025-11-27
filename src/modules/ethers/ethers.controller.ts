import { Controller, Get } from '@nestjs/common';

import { EthersService } from './ethers.service';

@Controller('ethers')
export class EthersController {
  constructor(private readonly ethersService: EthersService) {}

  @Get('/test')
  async test(): Promise<string> {
    return this.ethersService.getBalance(
      '0x0000000000000000000000000000000000000000',
    );
  }
}
