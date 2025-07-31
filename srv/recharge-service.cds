using my.recharge from '../db/rechargeType';


@path: 'recharge-api'

service RechargeService {
  entity RechargeType as projection on recharge.RechargeType;
}
