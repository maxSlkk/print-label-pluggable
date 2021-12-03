"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var placeHolder = function ($scope, $element) {
        
        this.getItems = () => {
            var items = [{
                text: "Print Stock Item Labels",  // Button name
                key: "PrintStockItemLabels",  // Button id (unique)
                icon: "icon-print",  // Button icon
                content: {
                    moduleName: "PrintStockItemLabels",
                    controlName: "PrintStockItemLabels"
                }
            }];

            return items;
        };

        this.isEnabled = (itemKey) => {            
            return true;
        };

        const wind = require('core/Window');
        var iframeCounter = 0;
        var macroResult;

        this.onClick = () => {
          const self = this;

          const macroService = new Services.MacroService(self);

          var orderId = $scope.orders[0];

          var obj = {
            Parameters:[
                {MacroId:181,ParameterName:"Address2",ParameterValue:false},
                {MacroId:181,ParameterName:"Address3",ParameterValue:false},
                {MacroId:181,ParameterName:"Country",ParameterValue:false},
                {MacroId:181,ParameterName:"Currency",ParameterValue:false},
                {MacroId:181,ParameterName:"FolderName",ParameterValue:"TestFromPlaceholder"},
                {MacroId:181,ParameterName:"FullName",ParameterValue:false},
                {MacroId:181,ParameterName:"PostalService",ParameterValue:true},
                {MacroId:181,ParameterName:"Region",ParameterValue:false},
                {MacroId:181,ParameterName:"Source",ParameterValue:false},
                {MacroId:181,ParameterName:"SubSource",ParameterValue:false},
                {MacroId:181,ParameterName:"Town",ParameterValue:false}
            ]
          };

          // RUN Macro to get necessary data
        //   macroService.Run(obj, function (data) {
        //     if (data.result.IsError == false) {
        //       macroResult = data.result;
        //       var printWindow = createWindow();
        //       printWindow.open();
        //     } else {
        //       alert(data.result.ErrorString);
        //     }
        //   });
        macroService.UpdateMacroParameters(obj, function(data){console.log(data);});
          
        };

        function createWindow(){
            var window = new wind({
                moduleName: "PrintStockItemLabelsViews",
                windowName: "PrintStockItemLabels",
                title: "Print Stock Item Label " + macroResult.PdfURLs[iframeCounter].Value,
                closeOnEscape: false,
                closeOnBackDrop: false,
                data: { URL: macroResult.PdfURLs[iframeCounter].Key },
                width: "764px",
                height: "900px",
                onWindowClosed: function (event) {
                    switch (event.action) {
                        case "OK":
                            $scope.CheckHasChanged();
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                            break;
                        case "CLOSE":
                            if (iframeCounter < macroResult.PdfURLs.length) {
                                var printWindow = createWindow();
                                printWindow.open();
                            }
                            else {
                                iframeCounter = 0;
                                macroResult = null;
                            }
                            if (event.result) {
                                $scope.CheckHasChanged();
                                if (!$scope.$$phase) {
                                    $scope.$apply();
                                }
                            }
                            break;
                    }
                },
                ngScope: $scope
            });
    
            iframeCounter++;
            
            return window;
        }
    };

    placeholderManager.register("OpenOrders_ProcessOrders_RightBottomButtons", placeHolder);

    $(this).ready(function($scope){
      console.log("this");
    });
  
    $(dialog).ready(function($scope) {
      console.log("dialog");
    });
});