/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { join } from 'path';

const jsonPath = join(
  process.cwd(),
  'src/modules/ethers/contracts',
  'FileStorage.json',
);
const contractJson = JSON.parse(readFileSync(jsonPath, 'utf-8'));

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = configService.getOrThrow<string>('RPC_URL');
    const privateKey = configService.getOrThrow<string>('WALLET_PRIVATE_KEY');
    const contractAddr =
      configService.getOrThrow<ethers.Contract>('CONTRACT_ADDRESS');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(
      contractAddr,
      contractJson.abi,
      this.wallet,
    );
  }

  async sendTransaction(
    fileId: number,
    fileHash: string,
    fileSignature: string,
  ): Promise<void> {
    const transaction = await this.contract.storeFile(
      fileId,
      fileHash,
      fileSignature,
    );
    const receipt = await transaction.wait();

    const block = (await this.provider.getBlock(
      receipt.blockNumber,
    )) as ethers.Block;

    console.log('Transaction hash:', transaction.hash);
    console.log('Block number:', receipt.blockNumber);
    console.log('Block hash:', block.hash);
    console.log('Block timestamp:', block.timestamp);
    console.log('Transactions in block:', block.transactions.length);
  }
}
