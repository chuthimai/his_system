import { Injectable } from '@nestjs/common';
import { JsonRpcProvider } from 'ethers';

@Injectable()
export class EthersService {
  private provider: JsonRpcProvider;

  constructor() {
    this.provider = new JsonRpcProvider('');
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return balance.toString();
  }
}
