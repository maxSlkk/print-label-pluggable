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
                text: "Print Stock Item Label",  // Button name
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
                    console.log("Here it is!");
                    
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
                
                var orderId = $scope.refundOpts.RefundHeader.OrderId;

                var obj = { applicationName: '292_PrintStockItemLabel', macroName: '292_PrintStockItemLabel', orderId: orderId };

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
    
    $(window).ready(function ($scope, sessionManagerService) {
        
          const config = { childList: true, subtree: true };

        function searchTree(element, matchingTitle) {
            var t = element.querySelectorAll("dialog ProcessedOrdersModule ProcessedOrders_RefundsView");
            
          if (element.querySelectorAll("dialog ProcessedOrdersModule ProcessedOrders_RefundsView") && element.baseURI.indexOf("Scanner") > - 1) {
            console.log("Founded external-ui-component");
            return element.querySelectorAll("iframe")[0];
          }


          else if (element.children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
              result = searchTree(element.children[i], matchingTitle);
            }
            return result;
          }
          return null;
        }

        var callback = function (mutationsList, observer) {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              for (const node of mutation.addedNodes) {
                var result = searchTree(node, "dialog ProcessedOrdersModule ProcessedOrders_RefundsView");
                if (result) {
                  console.log("Founded needed IFrame");
                  console.log(result);
                //   result.insertAdjacentHTML(
                //     "beforeend",
                //     '<div><iframe src="https://application.doodle-products.com"></iframe></div>'
                //   );
                  //result.src = result.src + "&userName=" + session.userName;
                  return;
                }
              }
            }
          }
        };

        const observer = new MutationObserver(callback);

        const session = JSON.parse(window.localStorage.getItem('SPA_auth_session'));

        setTimeout(function () {
          const targetNode = document.getElementsByClassName("dialog ProcessedOrdersModule ProcessedOrders_RefundsView")[0];
          observer.observe(targetNode, config);
        }, 2000);
    });

});