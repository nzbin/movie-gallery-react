require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

import React from 'react';
import ReactDOM from 'react-dom' //不要忘记引入

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

/*
 *获取区间内随机值
 *
 */
 function getRangeRandom(low,high){
	 return Math.floor(Math.random()*(high-low)+low);
 }

/*
 *生成单幅图片
 */
var ImgFigure = React.createClass ({

	render : function(){
		
		var styleObj = {};
	
		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		
		// // 如果是居中的图片， z-index设为11
		// if (this.props.arrange.isCenter) {
			  // styleObj.zIndex = 11;
		// }
		
		return(
			<figure className="img-figure" style={styleObj}>
				<div className="img-wrap"><img src={this.props.data.imageURL} alt={this.props.data.title}/></div>
				<figcaption>
					<h2 className="title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});

//遵循ES6语法
class AppComponent extends React.Component {
	
	Constant = {//。。。。。
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
		 
		 var imgsArrangeArr = this.state.imgsArrangeArr,
		 Constant = this.Constant,
		 centerPos = Constant.centerPos,
		 hPosRange = Constant.hPosRange,
		 vPosRange = Constant.vPosRange,
		 hPosRangeLeftSecX = hPosRange.leftSecX,
		 hPosRangeRightSecX = hPosRange.rightSecX,
		 hPosRangeY = hPosRange.y,
		 vPosRangeTopY = vPosRange.topY,
		 vPosRangeX = vPosRange.x,
		 
		 imgsArrangeTopArr = [],
		 topImgNum = Math.floor(Math.random()*2),//上方图片数量0或1
		 
		 topImgSpliceIndex = 0,
		 imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

		 //首先居中centerIndex
		 imgsArrangeCenterArr[0].pos = centerPos;//因为少写了pos
		 
		 //取出要布局上方图片的状态信息
		 topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
		 imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
		 
		 //布局上方图片
		 imgsArrangeTopArr.forEach(function(value,index){
			 imgsArrangeTopArr[index].pos = {
				 top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				 left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
			 }
		 });
		 
		 //布局左右两侧图片
		 for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
			 var hPosRangeLorRX = null;
			 
			 //前半部分布局左边，后半部分布局右边
			 if(i<k){
				 hPosRangeLorRX = hPosRangeLeftSecX;
			 }else{
				 hPosRangeLorRX = hPosRangeRightSecX;
			 }
			 
			 imgsArrangeArr[i].pos = {
				 top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				 left:getRangeRandom(hPosRangeLorRX[0],hPosRangeLorRX[1])
			 }
		 }
		 
		 //重新填充
		 if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			 imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		 }
		 
		 imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
		 
		 this.setState({
			 imgsArrangeArr:imgsArrangeArr
		 });
	 }
	 
	 constructor(props) {
        super(props);
        this.state = {
				imgsArrangeArr:[
				
				]
		}
    }
	
	 // getInitialState(){
		 // return {
			 // imgsArrangeArr:[
				 // // {
					 // // pos:{left:'0',top:'0'}
				 // // }
			 // ]
		 // };
	 // }
	
	//组件加载后，计算每张图片的位置
	componentDidMount(){
		//首先获取舞台大小
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDom.scrollWidth,
				stageH = stageDom.scrollHeight,//clientHeight无法获取
				halfStageW = Math.floor(stageW/2),
				halfStageH = Math.floor(stageH/2);
		
		//获得imageFigure的大小
		var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
				imgW = imgFigureDom.scrollWidth,
				imgH = imgFigureDom.scrollHeight,//clientHeight无法获取
				halfImgW = Math.floor(imgW/2),
				halfImgH = Math.floor(imgH/2);
				
		this.Constant.centerPos = {
			left:halfStageW-halfImgW,
			top:halfStageH-halfImgH
		}
		//计算左侧右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW-halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH-halfImgH;
		//alert(stageH);
		
		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH-halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		
		this.rearrange(0);
	}
	
	//开始渲染
	render() {
	  
		var controlUnits = [],imgFigures = [];
		//图片信息数据循环
		imageDatas.forEach(function(value,index){
			
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {//低级错误
					pos:{
						top:0,
						left:0
						}
				}
			}
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}/>)//。。。。。。
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
