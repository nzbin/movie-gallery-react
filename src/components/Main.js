require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

import React from 'react';

//将图片名信息转化为URL路径信息
function genImageURL(imageDatasArr){
	for(var i=0;i<imageDatasArr.length;i++){
		var singleImageData = imageDatasArr[i];
		
		singleImageData.imageURL = require('../images/'+singleImageData.fileName);
		
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
}
imageDatas = genImageURL(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
		<div className="stage">
			<section className="img-sec">

			</section>
			<nav className="control-nav">
			</nav>
		</div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
