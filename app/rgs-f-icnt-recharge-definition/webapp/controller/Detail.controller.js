sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("com.roche.rgsficntrechargedefinition.controller.Detail", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
      },
  
      _onObjectMatched: function (oEvent) {
        const oAppModel = this.getOwnerComponent().getModel("globalStorage");

    // Reset the layout to default
        oAppModel.setProperty("/layout", "TwoColumnsBeginExpanded");
        const sRechargeTypeId = oEvent.getParameter("arguments").rechargeTypeId;
        const sVersion = oEvent.getParameter("arguments").version;
      
        const sPath = `/RechargeType(rechargeTypeId='${sRechargeTypeId}',version='${sVersion}')`;
        this.getView().bindElement(sPath);
      },
      onBackToMain: function () {
        // Get FCL control from the App view
        const oFCL = this.getOwnerComponent().getRootControl().byId("flexibleColumnLayout");
    
        // Set the layout to show only the begin column
        oFCL.setLayout("OneColumn");
    
        // Navigate back to the main route
        this.getOwnerComponent().getRouter().navTo("Recharge");
    }
    
      
      
    });
  });
  