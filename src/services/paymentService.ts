import { walletTransactions } from "@/data/mockMarketplace";
import { mockDelay } from "@/services/mockTransport";

export const paymentService = {
  async getWallet() {
    await mockDelay();
    return {
      balance: 73500,
      transactions: walletTransactions
    };
  },

  async addFunds() {
    await mockDelay(520, 780);
    return { ok: true };
  }
};
