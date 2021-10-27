var PrintStockItemLabelsView = function ($scope) {
  let urlString = $scope._moduleInstance.options.data.URL;
  let iframe = document.getElementById("stockItemLabelFrame");
  
  iframe.src = urlString;
};
