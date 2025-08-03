sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "com/roche/rgsficntrechargedefinition/model/models"
], function (UIComponent, JSONModel, models) {
    "use strict";

    return UIComponent.extend("com.roche.rgsficntrechargedefinition.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // ✅ set global application model
            var oAppModel = new JSONModel({
                Layout: "OneColumn" // default layout
            });
            this.setModel(oAppModel, "globalStorage");

            // initialize routing
            this.getRouter().initialize();
        }
    });
});
