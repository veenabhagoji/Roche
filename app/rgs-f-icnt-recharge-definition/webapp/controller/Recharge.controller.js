sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment", 
    "sap/m/MessageToast",    
    "sap/m/MessageBox",      
    "sap/ui/model/Filter",   
    "sap/ui/model/FilterOperator" 
], (Controller, ValueHelpDialog, JSONModel, Fragment, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("com.roche.rgsficntrechargedefinition.controller.Recharge", {
        onInit() {
            this.formatter = this.getOwnerComponent().formatter;

            this.getView().setModel(new sap.ui.model.json.JSONModel(), "newRecharge");
        },

        onIDValueHelp: function (oEvent) {
            var oInput = oEvent.getSource();
            var oModel = this.getView().getModel(); // OData model

            if (!this._oVHD) {
                this._oVHD = new ValueHelpDialog({
                    supportMultiselect: false,
                    supportRanges: false,
                    key: "rechargeTypeID",
                    descriptionKey: "", // no description
                    title: "Select Recharge Type ID",

                    ok: function (oControlEvent) {
                        var aTokens = oControlEvent.getParameter("tokens");
                        if (aTokens.length) {
                            var selectedId = aTokens[0].getKey();
                            oInput.setValue(selectedId);

                            // Filter SmartFilterBar
                            var oSmartFilterBar = this.byId("smartFilterBar");
                            oSmartFilterBar.setFilterData({
                                rechargeTypeID: selectedId
                            });
                            oSmartFilterBar.search();
                        }
                        this._oVHD.close();
                    }.bind(this),

                    cancel: function () {
                        this._oVHD.close();
                    }.bind(this)
                });

                // Columns for dialog
                var oColModel = new JSONModel({
                    cols: [
                        {
                            label: "Recharge Type ID",
                            template: "rechargeTypeID",
                            width: "30%"
                        }
                    ]
                });

                var oTable = this._oVHD.getTable();
                oTable.setModel(oModel); // bind OData model
                oTable.bindRows("/RechargeType"); // <-- EntitySet from metadata
                oTable.setModel(oColModel, "columns"); // set columns model

                this.getView().addDependent(this._oVHD);
            }

            this._oVHD.open();
        },
        onVersionValueHelp: function (oEvent) {
            var oInput = oEvent.getSource();
            var oView = this.getView();
            var oODataModel = oView.getModel(); // your ODataModel
            var that = this;
        
            if (!this._oVersionDialog) {
                this._oVersionDialog = new sap.m.SelectDialog({
                    title: "Select Version",
                    noDataText: "No versions",
                    search: function (oEvt) {
                        var sValue = oEvt.getParameter("value");
                        var oFilter = new Filter("version", FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvt) {
                        var oSelected = oEvt.getParameter("selectedItem");
                        if (oSelected) {
                            var sVersion = oSelected.getTitle();
                            oInput.setValue(sVersion);
        
                            // Directly filter the SmartTable inner table by version
                            var oSmartTable = that.byId("smartTable");
                            var oInnerTable = oSmartTable.getTable(); // ResponsiveTable -> items aggregation
                            if (oInnerTable) {
                                var oBinding = oInnerTable.getBinding("items");
                                if (oBinding) {
                                    var oFilter = new Filter("version", FilterOperator.EQ, sVersion);
                                    oBinding.filter([oFilter]);
                                }
                            }
                        }
                    }
                });
        
                this._oVersionDialog.setModel(oODataModel);
                this._oVersionDialog.bindAggregation("items", {
                    path: "/RechargeType", // entity set
                    template: new sap.m.StandardListItem({
                        title: "{version}"
                    })
                });
        
                oView.addDependent(this._oVersionDialog);
            }
        
            // clear any existing filter in dialog
            this._oVersionDialog.getBinding("items").filter([]);
            this._oVersionDialog.open();
        },
     
        onRowPress: function (oEvent) {
            const oCtx = oEvent.getParameter("listItem").getBindingContext();
            if (!oCtx) {
              console.warn("No binding context found");
              return;
            }
          
            const rechargeTypeId = oCtx.getProperty("rechargeTypeId");
            const version = oCtx.getProperty("version");
          
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("detail", {
              rechargeTypeId,
              version,
              layout: sap.f.LayoutType.TwoColumnsBeginExpanded
            });
          },
          onCreatePress: function () {
            const oView = this.getView();
          
            // Reset the model
            const oModel = oView.getModel("newRecharge");
            oModel.setData({
              rechargeTypeId: "",
              version: "",
              rechargeType: "",
              rechargeTypeDesc: "",
              rechargeAssessmentReq: false,
              taxCode: "",
              validFrom: null,
              validTo: null,
              comment: ""
            });
          
            if (!this._oDialog) {
              Fragment.load({
                name: "com.roche.rgsficntrechargedefinition.view.fragment.RechargeCreateDialog",
                controller: this
              }).then(function (oDialog) {
                this._oDialog = oDialog;
                oView.addDependent(this._oDialog);
                this._oDialog.open();
              }.bind(this));
            } else {
              this._oDialog.open();
            }
          },
          
          onSaveRecharge: function () {
            const oData = this.getView().getModel("newRecharge").getData();
          
            // Add validation logic if needed
            if (!oData.rechargeTypeId || !oData.version) {
              MessageBox.warning("Please fill required fields.");
              return;
            }
          
          const oModel=this.getOwnerComponent().getModel();
            oModel.create("/RechargeType", oData, {
                success: () => {
                    MessageToast.show("Recharge Type Created");
                    this._oDialog.close();
                    oModel.refresh(); // refresh list/table
                    this._oDialog.close();
                },
                error: (oError) => {
                    MessageBox.error("Creation failed");
                    console.error(oError);
                }
            });
            // Post logic here (OData.create, batch, etc.)
          
          
           
          },
          
          onCancelRecharge: function () {
            this._oDialog.close();
          },

          onRechargeTypeValueHelp: function (oEvent) {
            var oInput = oEvent.getSource();
            var oView = this.getView();
            var oODataModel = oView.getModel();
            var that = this;
        
            if (!this._oRechargeTypeDialog) {
                this._oRechargeTypeDialog = new sap.m.SelectDialog({
                    title: "Select Recharge Type",
                    noDataText: "No recharge types found",
                    search: function (oEvt) {
                        var sValue = oEvt.getParameter("value");
                        var oFilter = new sap.ui.model.Filter("rechargeType", sap.ui.model.FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvt) {
                        var oSelected = oEvt.getParameter("selectedItem");
                        if (oSelected) {
                            var sRechargeType = oSelected.getTitle();
                            oInput.setValue(sRechargeType);
        
                            // Optional: apply filter on the SmartTable by rechargeType
                            var oSmartTable = that.byId("smartTable");
                            var oInnerTable = oSmartTable.getTable();
                            if (oInnerTable) {
                                var oBinding = oInnerTable.getBinding("items");
                                if (oBinding) {
                                    var oFilter = new sap.ui.model.Filter("rechargeType", sap.ui.model.FilterOperator.EQ, sRechargeType);
                                    oBinding.filter([oFilter]);
                                }
                            }
                        }
                    }
                });
        
                this._oRechargeTypeDialog.setModel(oODataModel);
                this._oRechargeTypeDialog.bindAggregation("items", {
                    path: "/RechargeType",
                    template: new sap.m.StandardListItem({
                        title: "{rechargeType}",
                        description: "{rechargeTypeDesc}"
                    })
                });
        
                oView.addDependent(this._oRechargeTypeDialog);
            }
        
            this._oRechargeTypeDialog.getBinding("items").filter([]);
            this._oRechargeTypeDialog.open();
        }
       
        
        
        
        

          
          
        
    });
});
