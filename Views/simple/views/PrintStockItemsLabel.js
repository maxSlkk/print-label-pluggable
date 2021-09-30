let iframeNumber = 1;

var PrintStockItemsLabelView = function ($scope) {
  let plkrFrame = document.getElementById("stockItemsLabelFrame");
  let url_string = $scope._moduleInstance.options.data.URL;
  plkrFrame.src = url_string;
};
