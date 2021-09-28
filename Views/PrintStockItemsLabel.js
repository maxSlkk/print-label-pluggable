var PrintStockItemsLabelView = function ($scope, $element, $filter, $compile, $q, $http) {
  var self = this;
  $scope.purchaseId = $scope.$parent.$parent.$parent.purchaseOrder.pkPurchaseID;
  $scope.purchaseNumber = $scope.$parent.$parent.$parent.purchaseOrder.ExternalInvoiceNumber;
  $scope.purchaseAmount = $scope.$parent.$parent.$parent.purchaseOrder.ConvertedGrandTotal;
  $scope.userId = $scope.$parent.$parent.$parent.$parent.$parent.$root.session.userId;
  let plkrFrame = document.getElementById("plkrFrame");
  let url_string = "https://pwp-test.herokuapp.com/pluggable/login";

  let frameUrl = url_string + "?userId=" + $scope.userId + "&purchaseNumber=" + $scope.purchaseNumber+ "&purchaseAmount=" + $scope.purchaseAmount;
  // let frameUrl = url_string;

  plkrFrame.src = frameUrl;

  // self.onMessage = function (msg) {
  //   switch (msg.key) {
  //     case Core.Messenger.MESSAGE_TYPES.INITIALIZE:
  //       $scope.Initialize();
  //   }
  // };

  
};
