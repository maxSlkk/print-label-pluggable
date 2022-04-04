// "use strict"

// define(function (require) {
//     const placeholderManager = require("core/placeholderManager");

//     var placeHolder = function ($scope, $element) {
        
//         this.getItems = () => {
//             var items = [{
//                 text: "Print Stock Item Labels",  // Button name
//                 key: "PrintStockItemLabels",  // Button id (unique)
//                 icon: "icon-print",  // Button icon
//                 content: {
//                     moduleName: "PrintStockItemLabels",
//                     controlName: "PrintStockItemLabels"
//                 }
//             }];

//             return items;
//         };

//         this.isEnabled = (itemKey) => {            
//             return true;
//         };

//         const wind = require('core/Window');
//         var iframeCounter = 0;
//         var macroResult;

//         this.onClick = () => {
//           const self = this;

//           const macroService = new Services.MacroService(self);

//           //var orderId = $scope.orders[0];

//           var obj = {
//             Parameters:[
//                 {MacroId:181,ParameterName:"Address2",ParameterValue:false},
//                 {MacroId:181,ParameterName:"Address3",ParameterValue:false},
//                 {MacroId:181,ParameterName:"Country",ParameterValue:false},
//                 {MacroId:181,ParameterName:"Currency",ParameterValue:false},
//                 {MacroId:181,ParameterName:"FolderName",ParameterValue:"TestFromPlaceholder"},
//                 {MacroId:181,ParameterName:"FullName",ParameterValue:false},
//                 {MacroId:181,ParameterName:"PostalService",ParameterValue:true},
//                 {MacroId:181,ParameterName:"Region",ParameterValue:false},
//                 {MacroId:181,ParameterName:"Source",ParameterValue:false},
//                 {MacroId:181,ParameterName:"SubSource",ParameterValue:false},
//                 {MacroId:181,ParameterName:"Town",ParameterValue:false}
//             ]
//           };
          
//         macroService.UpdateMacroParameters(obj, function(data){console.log(data);});
          
//         };

//         function createWindow(){
//             var window = new wind({
//                 moduleName: "PrintStockItemLabelsViews",
//                 windowName: "PrintStockItemLabels",
//                 title: "Print Stock Item Label " + macroResult.PdfURLs[iframeCounter].Value,
//                 closeOnEscape: false,
//                 closeOnBackDrop: false,
//                 data: { URL: macroResult.PdfURLs[iframeCounter].Key },
//                 width: "764px",
//                 height: "900px",
//                 onWindowClosed: function (event) {
//                     switch (event.action) {
//                         case "OK":
//                             $scope.CheckHasChanged();
//                             if (!$scope.$$phase) {
//                                 $scope.$apply();
//                             }
//                             break;
//                         case "CLOSE":
//                             if (iframeCounter < macroResult.PdfURLs.length) {
//                                 var printWindow = createWindow();
//                                 printWindow.open();
//                             }
//                             else {
//                                 iframeCounter = 0;
//                                 macroResult = null;
//                             }
//                             if (event.result) {
//                                 $scope.CheckHasChanged();
//                                 if (!$scope.$$phase) {
//                                     $scope.$apply();
//                                 }
//                             }
//                             break;
//                     }
//                 },
//                 ngScope: $scope
//             });
    
//             iframeCounter++;
            
//             return window;
//         }
//     };

//     placeholderManager.register("OpenOrders_ProcessOrders_RightBottomButtons", placeHolder);

//     $(this).ready(function($scope){
//       console.log("this");
//     });
  
//     $(dialog).ready(function($scope) {
//       console.log("dialog");
//     });
// });




//PLACEHOLDER FOR ADVANCED PERMISSIONS APP

"use strict";

define(function (require) {
  $(document).ready(function ($scope) {
    const config = { childList: true, subtree: true };

    var select_returnForm;
    var input_returnForm;
    var select_resendForm;
    var input_resendForm;

    var invaliditySpan = null;

    var allowedQuantity = 0;
    var isAllowedQuantitySet = false;
    var refundSum = 0.0;
    var isRefundSumSet = false;

    var callback = function (mutationsList, observer) {
        var rmaDiv = document.getElementsByClassName("RMA_AddView")[0];
        if (rmaDiv) {
            for (var span of rmaDiv.getElementsByTagName("span")) {
                if (span.classList.contains("invalidity")) {
                    invaliditySpan = span;
                    break;
                }
            }
        }

        var returnForm = document.getElementsByName("submissionForm.Return")[0];
        if (returnForm) {
            var selects = returnForm.getElementsByTagName("select");
            if (selects) {
                for (var select of selects) {
                    //making return location select readonly
                    if (select.getAttribute("lw-tst") === "select_returnLocation") {
                        select.disabled = true;
                    }
                    //checking if there is anything selected in category select
                    if (select.getAttribute("lw-tst") === "select_reasonCategory") {
                        select_returnForm = select;
                        select.required = true;
                        select.addEventListener("change", isReturnFormValid);
                    }
                }
            }

            //making refund input readonly
            var inputs = returnForm.getElementsByTagName("input");
            if (inputs) {
                for (var input of inputs) {
                    if (input.getAttribute("lw-tst") === "input_Refund") {
                        if (!isRefundSumSet) {
                            refundSum = parseFloat(input.value);
                            isRefundSumSet = true;
                        }
                        input.setAttribute('readonly', true);
                    }

                    if (input.getAttribute("lw-tst") === "input_returnQuantity") {
                        if (!isAllowedQuantitySet) {
                            allowedQuantity = parseInt(input.getAttribute("max"));
                            input.setAttribute("min", allowedQuantity);
                            isAllowedQuantitySet = true;
                        }
                        input_returnForm = input;
                        input.addEventListener("change", isReturnFormValid);
                    }
                }
            }

            //checking if button need to be disabled
            isReturnFormValid();
        }
        else {
            allowedQuantity = 0;
            isAllowedQuantitySet = false;
            refundSum = 0.0;
            isRefundSumSet = false;
        }
        
        //removing exchange tab and form
        var exchangeForm = document.getElementsByName("submissionForm.Exchange")[0];
        if (exchangeForm) {
            var lis = exchangeForm.parentElement.parentElement.parentElement.getElementsByTagName("li");
            if (lis) {
                for (var li of lis) {
                    if (li.getAttribute("lw-tst") === "tab_Exchange") {
                        //removing tab
                        li.remove();
                        //removing tab content
                        exchangeForm.parentElement.remove();
                        break;
                    }
                }
            }
        }
      
        var resendForm = document.getElementsByName("submissionForm.Resend")[0];
        if (resendForm) {
            var selects = resendForm.getElementsByTagName("select");
            if (selects) {
                for (var select of selects) {
                    //making return location select readonly
                    if (select.getAttribute("lw-tst") === "select_RMAOrderLocation") {
                        select.disabled = true;
                    }
                    //checking if there is anything selected in category select
                    if (select.getAttribute("lw-tst") === "select_reasonCategory") {
                        select_resendForm = select;
                        select.addEventListener("change", isResendFormValid);
                    }
                }
            }

            //making refund input readonly
            var inputs = resendForm.getElementsByTagName("input");
            if (inputs) {
                for (var input of inputs) {
                    if (input.getAttribute("lw-tst") === "input_Refund") {
                        input.value = refundSum;
                        input.setAttribute('readonly', true);
                    }

                    if (input.getAttribute("lw-tst") === "input_resendQuantity") {
                        input.setAttribute("max", allowedQuantity);
                        input_resendForm = input;
                        input.addEventListener("change", isResendFormValid);
                    }

                    if (input.getAttribute("lw-tst") === "input_additionalCost") {
                        input.setAttribute('readonly', true);
                    }
                }
            }

            //checking if button need to be disabled
            isResendFormValid();
        }

        var refundWindow = document.getElementsByClassName("Refund_AddView")[0];
        if (refundWindow) {
            var inputs = refundWindow.getElementsByTagName("input");
            if (inputs) {
                for (var input of inputs) {
                    if (input.getAttribute("lw-tst") === "number") {
                        var value = input.getAttribute("max");
                        input.value = parseFloat(value);
                        input.setAttribute('readonly', true);
                    }
                }
            }
        }
    };

    function isReturnFormValid() {
        var btn = getSubmitButton("Add Return");
        if (!btn) {
            // if (invaliditySpan) {
            //     invaliditySpan.innerHtml = "";
            // }
            return;
        }

        if (!select_returnForm || !input_returnForm) {
            btn.disabled = true;
            // if (invaliditySpan) {
            //     invaliditySpan.innerHtml = "";
            // }
            return;
        }

        if (select_returnForm.value === "?") {
            btn.disabled = true;
            console.log('select is empty!');
            // if (invaliditySpan) {
            //     console.log('1');
                 invaliditySpan.innerHtml = `<i>Return category is mandatory field</i>`;
            // }
            return;
        }

        if (!isNum(input_returnForm.value) || parseInt(input_returnForm.value) <= 0 
            || parseInt(input_returnForm.value) != allowedQuantity) {
            // if (invaliditySpan) {
            //     console.log('2');
            //     invaliditySpan.innerHtml = `<i>Return quantity cannot be less than the order item quantity</i>`;
            // }
            btn.disabled = true;
            return;
        }

        // if (invaliditySpan) {
        //     invaliditySpan.innerHtml = `<i>alsjflak</i>`;
        // }
        btn.disabled = false;
    }

    function isResendFormValid() {
        var btn = getSubmitButton("Add Resend");
        if (!btn) {
            // if (invaliditySpan) {
            //     invaliditySpan.innerHtml = "";
            // }
            return;
        }
        
        if (!select_resendForm || !input_resendForm) {
            btn.disabled = true;
            // if (invaliditySpan) {
            //     invaliditySpan.innerHtml = "";
            // }
            return;
        }

        if (select_resendForm.value === "?") {
            btn.disabled = true;
            // if (invaliditySpan) {
            //     console.log('3');
            //     invaliditySpan.innerHtml = `<i>Return category is mandatory field</i>`;
            // }
            return;
        }

        if (!isNum(input_resendForm.value) || parseInt(input_resendForm.value) <= 0 
            || parseInt(input_resendForm.value) > allowedQuantity) {
            btn.disabled = true;
            // if (invaliditySpan) {
            //     console.log('4');
            //     invaliditySpan.innerHtml = `<i>Return quantity cannot be less than the order item quantity</i>`;
            // }
            return;
        }

        btn.disabled = false;
    }

    function isNum (str) {
        return /^\d+$/.test(str);
    }

    function getSubmitButton(text) {
        var btnsDiv = document.getElementsByClassName("buttons")[1];
        if (btnsDiv) {
            var buttons = btnsDiv.getElementsByTagName("button");
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].firstChild.nodeValue === text) {
                        return buttons[i];
                    }
                }
            }
        }
    }

    const observer = new MutationObserver(callback);

    const session = JSON.parse(window.localStorage.getItem("SPA_auth_session"));

    const userPermissions = JSON.parse(getUserPermissions(session.userName, session.token));
    
    setTimeout(function () {
      const targetNode = document.getElementsByTagName("body")[0];
      observer.observe(targetNode, config);
    }, 2000);
  });

  function getUserPermissions(userEmail, token) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://linnworks-apps.brainence.info/api/getUserConfiguration?userEmail="+userEmail, false);
    xmlHttp.setRequestHeader('Authorization', token);
    xmlHttp.send(null);
    return xmlHttp.responseText;
  }
});