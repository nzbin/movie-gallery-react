require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

import React from 'react';
import ReactDOM from 'react-dom' //不要忘记引入

/*
 *将图片名信息转化为URL路径信息
 *@param imageDatasArr 传入数据
 */
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
*@param min 区间最小值
*@param max 区间最大值
*/
function getRangeRandom(min,max){
	return Math.floor(Math.random()*(max-min)+min);
}
 
/*
*获取旋转角度随机值       PS：其实可以直接使用上面定义的随机区间函数
*@param 自定义旋转角度
*/
function getRotateRandom(deg){
	return ((Math.random()>0.5 ? '':'-')+Math.floor(Math.random()*deg));
}
 
 
/*
 *生成单幅图片
 */
var ImgFigure = React.createClass ({
	
	/*
	 *imgFigure 的点击处理函数
	 */
	 handleClick:function(e){
		 
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		 
		 e.stopPropagation();
		 e.preventDefault();
	 },
	 
	render : function(){
		
		var styleObj = {};
	
		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		
		//如果图片的旋转角度有值且不为0
		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
				styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
		}
		
		//图片正反切换      PS：由于图片的翻转[rotateY]和旋转[rotateX]都在一个div上操作，所以只有居中元素才可以翻转
		var imgFigureClassName = 'img-figure';
			  imgFigureClassName +=this.props.arrange.isInverse ? ' isInverse' : '';//注意类之间的空格
			  
		// 如果是居中的图片， z-index设为11
		if (this.props.arrange.isCenter) {
			  styleObj.zIndex = 101;
		}
		
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<div className="img-wrap"><img src={this.props.data.imageURL} alt={this.props.data.title}/></div>
				<figcaption>
					<h2 className="title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
						{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
});

//控制组件
var ControlUnit = React.createClass({
	handleClick : function(e){
		
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		 
		 e.stopPropagation();
		 e.preventDefault();
	},
	render : function(){
		
		var controlUnitClassName = 'control-unit';
		//显示居中态按钮
		if(this.props.arrange.isCenter){
			controlUnitClassName +=' is-center';
			//显示反转态按钮
			if(this.props.arrange.isInverse){
				controlUnitClassName +=' is-inverse';
			}
		}
		
		return(
			<span className={controlUnitClassName} onClick={this.handleClick}></span>
		)
	}
});

//遵循ES6语法
class AppComponent extends React.Component {
	
	Constant = {//注意语法
		centerPos:{
			top:0,
			left:0
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
	 *翻转index图片
	 *@param index 输入当前被执行翻转的图片对应的的数组的index
	 *@return {function}是闭包函数，其中return的函数是真正待执行的函数
	 */
	 inverse(index){
		 return function(){
			 var imgsArrangeArr = this.state.imgsArrangeArr;
			 imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			 this.setState({
				 imgsArrangeArr:imgsArrangeArr
			 });
		 }.bind(this);
	 }
	 	 
	/*
	 * 布局所有图片
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

		 //首先居中centerIndex,无须旋转
		 imgsArrangeCenterArr[0] = {
			 pos : centerPos,//因为少写了pos
			 rotate : 0,
			 isCenter : true
		 };
		 
		 //取出要布局上方图片的状态信息
		 topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
		 imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
		 
		 //布局上方图片
		 imgsArrangeTopArr.forEach(function(value,index){
			 
			 imgsArrangeTopArr[index] = {
				 pos : {
					 top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					 left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				 },
				 rotate : getRotateRandom(30),
				 isCenter : false
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
			 
			 imgsArrangeArr[i] = {
				 pos : {
					 top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					 left:getRangeRandom(hPosRangeLorRX[0],hPosRangeLorRX[1])
				 },
				 rotate : getRotateRandom(30),
				 isCenter : false
			 }
			 
		 }
		 
		 //重新填充
		 if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			 imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		 }
		 
		 imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
		 
		 this.setState({//。。。。。。
			 imgsArrangeArr:imgsArrangeArr
		 });
	 }
	 
	 /*
	  *居中index图片
	  *@param index, 需要居中的图片的index值
	  *return {function}
	  */
	 center(index){
		 return function(){
			 this.rearrange(index);
		 }.bind(this);
	 }
	 
	 constructor(props) {
        super(props);
        this.state = {
			imgsArrangeArr:[
			 /* {
				   pos: {left:'0',top:'0'}
				   rotate: 0,   //旋转角度
				   isInverse: false, //图片正反
				   isCenter: false
			 }*/
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
					},
					rotate:0,
					isInverse: false,
					isCenter: false
				}
			}
			
			imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);//犯了多个错误（T_T）
			
			controlUnits.push(<ControlUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
			
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