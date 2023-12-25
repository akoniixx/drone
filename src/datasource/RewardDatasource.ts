import {BASE_URL, httpClient} from '../config/develop-config';

interface RewardPayload {
  page: number;
  take: number;
}
export interface RedeemPayload {
  dronerId: string;
  rewardId: string;
  quantity: number;
  receiverDetail: {
    firstname: string;
    lastname: string;
    tel: string;
    address: string;
    addressId: string;
  };
  updateBy: string;
}

export interface RedeemMissionPayload {
  missionId: string;
  step: number;
  dronerId: string;
  rewardId: string;
  quantity: number;
  updateBy: string;
  receiverDetail: {
    firstname: string;
    lastname: string;
    tel: string;
    address: string;
    addressId: string;
  };
}
const getListRewards = async ({page, take}: RewardPayload) => {
  return httpClient
    .get(BASE_URL + '/promotion/reward/queryall', {
      params: {
        page: page,
        take: take,
        status: 'ACTIVE',
        rewardExchange: 'SCORE',
        // rewardType: 'PHYSICAL',
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getRewardDetail = async (id: string) => {
  return httpClient
    .get(BASE_URL + '/promotion/reward/query/' + id)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const redeemReward = async (payload: RedeemPayload) => {
  return httpClient
    .post(BASE_URL + '/promotion/droner-transactions/redeem-reward', {
      ...payload,
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getRedeemDetail = async (id: string) => {
  return httpClient
    .get(
      BASE_URL +
        '/promotion/droner-transactions/get-droner-reward-history/' +
        id,
    )
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getHistoryRedeem = async (payload: {
  dronerId: string;
  take: number;
  page: number;
}) => {
  const genQuery = Object.keys(payload).map(key => {
    return key + '=' + payload[key as keyof typeof payload];
  });
  return httpClient
    .get(
      BASE_URL +
        '/promotion/reward/my-reward-history/' +
        '?' +
        genQuery.join('&'),
    )
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getHistoryReadyToUseRedeem = async (payload: {
  dronerId: string;
  take: number;
  page: number;
}) => {
  const genQuery = Object.keys(payload).map(key => {
    return key + '=' + payload[key as keyof typeof payload];
  });
  return httpClient
    .get(
      BASE_URL +
        '/promotion/reward/my-reward-ready-to-use/' +
        '?' +
        genQuery.join('&'),
    )
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const redeemRewardMission = async (payload: RedeemMissionPayload) => {
  return httpClient
    .post(BASE_URL + '/promotion/droner-transactions/redeem-reward', {
      ...payload,
    })
    .then(res => {
      return res.data;
    });
};
const getRewardStatus = async (payload: {
  dronerId: string;
  missionId: string;
  rewardId: string;
}) => {
  const genQuery = Object.keys(payload).map(key => {
    return key + '=' + payload[key as keyof typeof payload];
  });

  return httpClient
    .get(BASE_URL + '/promotion/reward/get-redeem-status?' + genQuery.join('&'))
    .then(res => {
      return res.data;
    });
};
const useRedeemCode = async (payload: {
  dronerTransactionId: string;
  branchCode: string;
  branchName: string;
  updateBy: string;
}) => {
  return httpClient
    .post(BASE_URL + '/promotion/droner-transactions/use-redeem-code', payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const redeemRewardDigital = async (payload: any) => {
  return httpClient
    .post(BASE_URL + '/promotion/droner-transactions/redeem-reward', {
      ...payload,
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getAllCompany = async () => {
  return httpClient
    .get(BASE_URL + '/company/find-all-company?isActive=true')
    .then(res => {
      return res.data;
    });
};
export const rewardDatasource = {
  getListRewards,
  getRewardDetail,
  redeemReward,
  redeemRewardDigital,
  getRedeemDetail,
  getHistoryRedeem,
  redeemRewardMission,
  getRewardStatus,
  useRedeemCode,
  getHistoryReadyToUseRedeem,
  getAllCompany,
};
