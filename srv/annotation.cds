using RechargeService as service from '../srv/recharge-service';

annotate service.RechargeType with @(
  UI.LineItem: [
    { Value: rechargeTypeId },
    { Value: version },
    { Value: rechargeType },
    { Value: rechargeTypeDesc },
    { Value: rechargeAssessmentReq },
    { Value: taxCode },
    { Value: validFrom },
    { Value: validTo },
    { Value: comment }
  ],

   UI.SelectionFields: [
    rechargeTypeId,
    version,
    validFrom
  ]
);
