import { PaymentRecord, PaymentMethodType } from '../../types';
import { simulateNetworkDelay } from '../api/apiClient';

class PaymentService {
  async processPayment(params: {
    bookingId: string;
    amount: number;
    provider: PaymentMethodType;
  }): Promise<{ success: boolean; record: PaymentRecord; simulationNote: string }> {
    await simulateNetworkDelay(800);

    const record: PaymentRecord = {
      id: `pay_${Date.now()}`,
      bookingId: params.bookingId,
      provider: params.provider,
      providerPaymentId: `SIM_TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      amount: params.amount,
      currency: 'INR',
      paymentStatus: 'simulated_paid',
      isSimulated: true,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      record,
      simulationNote: 'This transaction was processed in prototype simulation mode. No actual money was deducted.',
    };
  }
}

export const paymentService = new PaymentService();
