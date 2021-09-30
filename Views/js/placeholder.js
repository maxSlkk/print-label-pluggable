"use strict"

define(function (require) {
    const placeholderManager = require("core/placeholderManager");

    var docDefinition;

    var placeHolder = function ($scope, $element, controlService) {
        
        this.onLoad = () => {
            var btns = $element[0].children[0].children[3].children;
                        
            for (var i = 0; i < btns.length; i++) 
            {
                var el = btns[i];
               
                if(el.innerText == " Action")
                {
                  el.style.display="none";
                }
            }
        };
        
        //const _this = this;
        this.getItems = () => {
            var items = [{
                text: "Print Stock Items Label",  // Button name
                key: "PrintStockItemsLabel",  // Button id (unique)
                icon: "icon-print",  // Button icon
                content: {
                    moduleName: "PrintStockItemsLabel",
                    controlName: "PrintStockItemsLabel"
                }
            }];

            return items;
        };

        this.isEnabled = (itemKey) => {
            
             var btns = $element[0].children[0].children[3].children;
                        
            for (var i = 0; i < btns.length; i++) 
            {
                var el = btns[i];
               
                if(el.innerText == " Action")
                {
                     el.style.display="none";
                }
            }
            
            return true;
        };

        const wind = require('core/Window');
        var iframeCounter = 0;
        var macroResult;

        this.onClick = () => {
          
            let isExecuted = confirm("Are you sure to execute this action?");
            
            if(isExecuted)
            {
                const self = this;

                const macroService = new Services.MacroService(self);
                
                var orderId = $scope.orders[0];

                var obj = { applicationName: 'TEST_292_PrintStockItemLabel', macroName: 'TEST_292_PrintLableMacro', orderId: orderId };

                const busyWorker = require("core/busyWorker/busyWorker");
                busyWorker.showBusy("Updating");
                
                // RUN Macro to get necessary data
                macroService.Run(obj, function (data) {
                    if ((data.result.IsError == false)) {
                        busyWorker.hideBusy();
                        macroResult = data.result;
                        var printWindow = createWindow();
                        printWindow.open();
                    } else {
                        alert(data.result.ErrorString);
                    }
                });
            }
        };

        function createWindow(){
            var window = new wind({
                moduleName: "PrintStockItemsLabel",
                windowName: "PrintStockItemsLabel",
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
                            if(iframeCounter < macroResult.PdfURLs.length){
                                var printWindow = createWindow()
                                printWindow.open();
                            }
                            else{
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