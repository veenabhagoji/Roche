namespace my.recharge;

entity RechargeType {
  key rechargeTypeId      : String(30);
  key version             : String(30);
  rechargeType            : String(50);
  rechargeTypeDesc        : String(255);
  rechargeAssessmentReq   : Boolean;
  taxCode                 : String(20);
  validFrom               : Date;
  validTo                 : Date;
  comment                 : String(500);
}
