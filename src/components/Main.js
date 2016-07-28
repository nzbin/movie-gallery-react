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

//
var ImgFigure = React.createClass ({
	render : function(){
		return(
			<figure className="img-figure">
				<div className="img-wrap"><img src={this.props.data.imageURL} alt={this.props.data.title}/></div>
				<figcaption>
					<h2 className="title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});

//
class AppComponent extends React.Component {
	Constant:{
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{//水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{//垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	}
	
	/*
	 * 重新布局所有图片
	 *@param centerIndex 指定居中的图片
	 */
	 
	 rearrange(centerIndex){
		 
	 }
	 
	 getInitialStage(){
		 return {
			 imgsArrangeArr:[
				 {
					 //pos:{left:'0',top:'0'}
				 }
			 ]
		 };
	 }
	
	//组件加载后，计算每张图片的位置
	componentDidMount(){
		//首先获取舞台大小
		var stageDom = React.findDOMNode(this.refs.stage),
				stageW = stageDom.scrollWidth,
				stageH = stageDom.scrollHeight,
				halfStageW = Math.ceil(stageW/2),
				halfStageH = Math.ceil(stageH/2);
		
		//获得imageFigure的大小
		var imgFigureDom = React.findDOMNode(this.refs.imgFigure0),
				imgW = imgFigureDom.scrollWidth,
				imgH = imgFigureDom.scrollHeight,
				halfImgW = Math.ceil(imgW/2),
				halfImgH = Math.ceil(imgH/2);
				
		this.Constant.centerPos = {
			left:halfStageW-halfImgW,
			top:halfStageH-halfImgH
		}
		//计算左侧右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSexX[0] = -halfImgW;
		this.Constant.hPosRange.leftSexX[1] = halfStageW-halfImgW * 3;
		this.Constant.hPosRange.rightSexX[1] = halfStageW-halfImgW;
		this.Constant.hPosRange.rightSexX[1] = stageW-halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgW;
		this.Constant.hPosRange.y[1] = stageH-halfImgH;
		
		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH-halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		
		this.rearrange(0);
	}
	
  render() {
	  
	var controlUnits = [],imgFigures = [];
	//图片信息数据循环
	imageDatas.forEach(function(value,index){
		
		if(!this.state.imgsArrangeArr[index]){
			this.state.imgArrangeArr[index] = {
				pos:{left:0,top:0}
			}
		}
		imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}/>)
	}.bind(this));
	  
    return (
		<div className="stage" ref="stage">
			<section className="img-sec">
				{imgFigures}
			</section>
			<nav className="control-nav">
			    {controlUnits}
			</nav>
		</div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
