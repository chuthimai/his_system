import { BillingModule } from '@modules/billing/billing.module';
import { forwardRef, Module } from '@nestjs/common';

import { PaymentService } from './payments.service';

@Module({
  imports: [forwardRef(() => BillingModule)],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
