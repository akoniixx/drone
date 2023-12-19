export interface RedemptionTransaction {
  dronerTransactionsId: string;
  redeemDetail: RedeemDetail;
  rewardId: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  dronerRedeemHistoriesId: string;
  redeemDate: string;
}

interface RedeemDetail {
  remark: string;
  rewardType: string;
  trackingNo: string;
  redeemStatus: string;
  deliveryCompany: {
    isRedeem: boolean;
    redeemCode: string;
  };
}
