var PrintStockItemsLabelView = function ($scope) {
  let urlString = $scope._moduleInstance.options.data.URL;
  let iframeNumber = $scope._moduleInstance.options.data.IframeNumber;

  const newIframe = document.createElement('iframe');
  newIframe.setAttribute('id', 'stockItemLabelFrame' + iframeNumber);
  newIframe.setAttribute('src', urlString);
  newIframe.setAttribute('class', 'stockItemLabelFrame');
  
  iframeNumber++;
  
  const iframeParent = document.getElementsByClassName('iframe-container')[0].getElementsByClassName('content')[0].getElementsByTagName('div')[0];
  iframeParent.appendChild(newIframe);
};
