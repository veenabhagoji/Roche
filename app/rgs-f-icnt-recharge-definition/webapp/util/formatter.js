sap.ui.define([
    "sap/ui/core/format/DateFormat"
  ], function(DateFormat) {
    "use strict";
  
    return {
      formatMediumDate: function(sValue) {
        if (!sValue) return "";
        const oDate = new Date(sValue);
        const oFormatter = DateFormat.getDateInstance({ style: "medium" });
        return oFormatter.format(oDate);
      }
    };
  });
  