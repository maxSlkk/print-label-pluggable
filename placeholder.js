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
                key: "placeholderActionPrintLabel",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                content: {
                    moduleName: "placeholderActionPrintLabelTemplate",
                    controlName: "placeholderActionPrintLabelTemplate"
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

        this.onClick = () => {
          
            let isExecuted = confirm("Are you sure to execute this action?");
            
            if(isExecuted)
            {
                const self = this;

                const macroService = new Services.MacroService(self);
                
                var orderId = $scope.orders[0];

                var obj = { applicationName: 'TEST_292_PrintStockItemLabel', macroName: 'TEST_292_PrintLableMacro', orderId: orderId };

                // RUN Macro to get necessary data
                macroService.Run(obj, function (data) {
                    if ((data.result.IsError == false)) {
                        var res = data.result;
                    } else {
                        alert(data.result.ErrorString);
                    }
                });
            }
        };
    };

    placeholderManager.register("OpenOrders_ProcessOrders_RightBottomButtons", placeHolder);

    $(this).ready(function($scope){
      console.log("this");
    });
  
    $(dialog).ready(function($scope) {
      console.log("dialog");
    });
});