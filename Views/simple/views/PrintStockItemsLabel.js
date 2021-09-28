var PrintStockItemsLabelView = function ($scope, $element, $filter, $compile, $q, $http) {
  var self = this;
  let plkrFrame = document.getElementById("stockItemsLabelFrame");
  let url_string = $scope._moduleInstance.options.data.URL;
  plkrFrame.src = url_string;
};
