enchant();							// enchantライブラリ呼び出し
var game,stage;						// GameCore,SceneGroupオブジェクト 

var gs = {fps:15};					// Gameのfps
gs.canvas = {height:320,width:320};	// Windowの高さ，幅

// 拡張Core
var eCore = enchant.Class.create(enchant.nineleap.Core,{
	initialize:function(color){	// コンストラクタ
		enchant.nineleap.Core.call(this,gs.canvas.width,gs.canvas.height);
		this.fps = gs.fps;
		this.rootScene.backgroundColor = color || "white";
	}
});

var Generator = (function() {
    function Generator(){}
    
    Generator.number = function(range,offset) {
        var result = Math.floor(Math.random() * range);
        return offset ? result+offset : result;
    };
    
    Generator.color = function() {
        var color = 255;
        return [
            "rgb("
            ,[this.number(color),this.number(color),this.number(color)]
            ,")"
        ].join("");
    };
    
    Generator.position = function(x,y) {
        return {x:this.number(x),y:this.number(y)};
    };
        
    return Generator;
}());


//	==================================================
//	Template create 2014-07-26
//	==================================================

var TYPE =  {LINE:0,RECT:1,CIRCLE:2};
var STYLE = {STROKE:0,FILL:1};

var Shape = enchant.Class.create(enchant.Surface,{
	initialize:function(width,height,color,style){
		enchant.Surface.call(this,50,50);
		this.color = color  || Generator.color();
		this.style = style  || STYLE.STROKE;
	},
	beginPath:function(){
		this.context.beginPath();
	},
	stroke:function(){
		this.context.strokeStyle = this.color;
		this.context.stroke();
	},
	fill:function(){
		this.context.fillStyle = this.color;
		this.context.fill();
	},
	draw:function(){
		this.beginPath();
		this.drawPath();
		if (this.style === STYLE.STROKE) this.stroke();
		else if (this.style === STYLE.FILL) this.fill(); 
	}
});

var Line = enchant.Class.create(Shape,{
	initialize:function(width,height,color,path){
		Shape.call(this,width,height,color);
		this.path = path || {start:{x:0,y:25},end:{x:50,y:25}};
	},
	drawPath:function(){
		this.context.moveTo(this.path.start.x,this.path.start.y);
		this.context.lineTo(this.path.end.x,this.path.end.y);
	}
});

var Rect = enchant.Class.create(Shape,{
	initialize:function(width,height,color,style,start,range){
		Shape.call(this,width,height,color,style);
		this.start = start || {x:0,y:0};
		this.range = range || {width:50,height:50};
	},
	drawPath:function(){
		this.context.rect(
			this.start.x,this.start.y
			,this.range.width,this.range.height);
	}
});

var Circle = enchant.Class.create(Shape,{
	initialize:function(width,height,color,style,radius,position){
		Shape.call(this,width,height,color,style);
		this.radius = radius || 20;
		this.position = position || {x:25,y:25};
		this.angle = {start:0,end:Math.PI * 2};
		this.anticlockwise = true;
	},
	drawPath:function(){
		this.context.arc(this.position.x,this.position.y,this.radius
			,this.angle.start,this.angle.end,this.anticlockwise);
	}
});

var ShapeContainer = enchant.Class.create(enchant.Sprite,{
	initialize:function(width,height){
		enchant.Sprite.call(this,width,height);
		this.image = ShapeBuilder(width,height);
		this.image.draw();
		this.x = Generator.number(220);
		this.y = Generator.number(220);
	},
	onenterframe:function(){
		this.scale(1.1,1.1);
		if (this.age > 10)
			stage.removeChild(this);
	}
});

var ShapeBuilder = function(width,height){
	var _shape;
	var _color = Generator.color(); 
	switch(Generator.number(5)) {
	case 0:
		_shape = new Line(width,height,_color);
		break;
	case 1:
		_shape = new Rect(width,height,_color,STYLE.STROKE);
		break;
	case 2:
		_shape = new Rect(width,height,_color,STYLE.FILL);
		break;
	case 3:
		_shape = new Circle(width,height,_color,STYLE.STROKE);
		break;
	case 4:
		_shape = new Circle(width,height,_color,STYLE.FILL);
		break;
	}
	return _shape;
}


window.onload = function(){
	game  = new eCore("mintcream");
	stage = game.rootScene;

	game.onload = function(){
		stage.on("enterframe",function(){
			if(this.age % 3 === 0)
				this.addChild(new ShapeContainer(50,50));
		});
	};

	game.start();
};