import { BillingService } from '@modules/billing/billing.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentLinkResponse, PaymentLink, PayOS } from '@payos/node';

@Injectable()
export class PaymentService {
  private readonly payosConfig: PayOS;
  private paymentLinkIds: string[] = [];
  private isChecking = false;
  private isRunningTask = false;
  private checkInterval = 3000;

  constructor(
    private readonly configService: ConfigService,
    private readonly billingService: BillingService,
  ) {
    this.payosConfig = new PayOS({
      clientId: configService.getOrThrow('PAYOS_CLIENT_ID'),
      apiKey: configService.getOrThrow('PAYOS_API_KEY'),
      checksumKey: configService.getOrThrow('PAYOS_CHECKSUM_KEY'),
    });
  }

  startChecking() {
    if (this.isChecking) return;

    this.isChecking = true;
    void this.runCheck();
  }

  stopChecking() {
    this.isChecking = false;
  }

  private runCheck() {
    if (!this.paymentLinkIds.length) {
      this.stopChecking();
      return;
    }

    if (!this.isRunningTask) {
      this.isRunningTask = true;
      this.updatePayments()
        .catch(() => {})
        .finally(() => {
          this.isRunningTask = false;
        });
    }

    if (this.isChecking) {
      setTimeout(() => this.runCheck(), this.checkInterval);
    }
  }

  async createPayment(
    amount: number,
    description: string,
  ): Promise<CreatePaymentLinkResponse> {
    const orderCode = Math.floor(Math.random() * 1e7) + 1;
    const paymentInfo = await this.payosConfig.paymentRequests.create({
      orderCode,
      amount,
      description,
      returnUrl: '',
      cancelUrl: '',
    });

    this.paymentLinkIds.push(paymentInfo.paymentLinkId);
    this.startChecking();

    return paymentInfo;
  }

  async updatePayments(): Promise<void> {
    const checkResults = await Promise.all(
      this.paymentLinkIds.map(async (paymentLinkId) => {
        const res = await this.payosConfig.paymentRequests.get(paymentLinkId);
        if (res.status === 'PAID') {
          await this.billingService.updateTransaction(paymentLinkId);
        }
        return { id: paymentLinkId, status: res.status };
      }),
    );

    this.paymentLinkIds = checkResults
      .filter((checkResult) => checkResult.status !== 'PAID')
      .map((checkResult) => checkResult.id);
  }

  async checkPayment(paymentLinkId: string): Promise<PaymentLink> {
    return await this.payosConfig.paymentRequests.get(paymentLinkId);
  }
}
