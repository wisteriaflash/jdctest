var ON_MOUSE_DOWN = 0,
    ON_MOUSE_UP = 1,
    ON_MOUSE_OVER = 2,
    ON_MOUSE_OUT = 3,
    ON_DRAG_START = 4,
    ON_DRAG_END = 5;
	
function CGfxButton(_posX, _posY, _width, _height, _buttonImage, _needAddToStage) {
    var eventCallBackArray, eventCallBackExecuterArray, buttonBitMap, scaleX, scaleY;
    this._init = function(_posX, _posY, _width, _height, _buttonImage, _needAddToStage) {
        eventCallBackArray = [];
        eventCallBackExecuterArray = [];
        buttonBitMap = new createjs.Bitmap(_buttonImage);
        buttonBitMap.x = _posX;
        buttonBitMap.y = _posY;
		
		buttonBitMap.scaleX = scaleX = _width / _buttonImage.width;
		buttonBitMap.scaleY = scaleY = _height / _buttonImage.height;
		//////console.debug("BTN: " + buttonBitMap.scaleX + " " + buttonBitMap.scaleY);
		
        buttonBitMap.regX = _buttonImage.width / 2;
        buttonBitMap.regY = _buttonImage.height / 2;
        _needAddToStage && s_oStage.addChild(buttonBitMap);
        this._initListener()
    };
    this.unload = function() {
        buttonBitMap.off("mousedown");
        buttonBitMap.off("pressup")
    };
    this.setVisible = function(isVisible) {
        buttonBitMap.visible = isVisible
    };
    this._initListener = function() {
        buttonBitMap.on("mousedown", this.buttonDown);
        buttonBitMap.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(_eventType, _eventCallback, _callbackExecuter) {
        eventCallBackArray[_eventType] = _eventCallback;
        eventCallBackExecuterArray[_eventType] = _callbackExecuter
    };
    this.buttonRelease = function() {
        buttonBitMap.scaleX = scaleX;
        buttonBitMap.scaleY = scaleY;
        eventCallBackArray[ON_MOUSE_UP] && eventCallBackArray[ON_MOUSE_UP].call(eventCallBackExecuterArray[ON_MOUSE_UP])
    };
    this.buttonDown = function() {
        buttonBitMap.scaleX = scaleX * 0.9;
		buttonBitMap.scaleY = scaleY * 0.9;
        eventCallBackArray[ON_MOUSE_DOWN] && eventCallBackArray[ON_MOUSE_DOWN].call(eventCallBackExecuterArray[ON_MOUSE_DOWN])
    };
    this.setPosition = function(a, b) {
        buttonBitMap.x = a;
        buttonBitMap.y = b
    };
    this.setX = function(a) {
        buttonBitMap.x = a
    };
    this.setY = function(a) {
        buttonBitMap.y = a
    };
    this.getButtonImage = function() {
        return buttonBitMap
    };
    this.getX = function() {
        return buttonBitMap.x
    };
    this.getY = function() {
        return buttonBitMap.y
    };
    this._init(_posX, _posY, _width, _height, _buttonImage, _needAddToStage);
    return this
}

function CToggle(_posX, _posY, _width, _height, _image, _active){
	var isActive, f, c, sprite, scaleX, scaleY;
	this._init = function(_posX, _posY, _width, _height, _image, _active) {
		f = [];
		c = [];
		this.resize(_posX, _posY, _width, _height, _image, _active);
		this._initListener();
	};
	
	this.resize = function(_posX, _posY, _width, _height, _image, _active) {
		if (sprite && s_oStage) s_oStage.removeChild(sprite);
		d = new createjs.SpriteSheet({
			images: [_image],
			frames: {
				width: _image.width / 2,
				height: _image.height,
				regX: _image.width / 2 / 2,
				regY: _image.height / 2
			},
			animations: {
				state_false: [0, 1],
				state_true: [1, 2]
			}
		});
		isActive = _active;
		sprite = new createjs.Sprite(d, "state_" + isActive);
		sprite.x = _posX;
		sprite.y = _posY;
		sprite.scaleX = scaleX = _width / (_image.width / 2);
		sprite.scaleY = scaleY = _height / _image.height;
		sprite.stop();
		s_oStage.addChild(sprite);
	}
	this.unload = function() {
		sprite.off("mousedown", this.buttonDown);
		sprite.off("pressup", this.buttonRelease);
		s_oStage.removeChild(sprite)
	};
	this._initListener = function() {
		sprite.on("mousedown", this.buttonDown);
		sprite.on("pressup", this.buttonRelease);
	};
	this.addEventListener = function(a, b, d) {
		f[a] = b;
		c[a] = d
	};
	this.buttonRelease = function() {
		sprite.scaleX = scaleX;
		sprite.scaleY = scaleY;
		isActive = !isActive;
		sprite.gotoAndStop("state_" + isActive);
		f[ON_MOUSE_UP] && f[ON_MOUSE_UP].call(c[ON_MOUSE_UP], isActive)
	};
	this.buttonDown = function() {
		sprite.scaleX = scaleX * 0.9;
		sprite.scaleY = scaleY * 0.9;
		f[ON_MOUSE_DOWN] && f[ON_MOUSE_DOWN].call(c[ON_MOUSE_DOWN])
	};
	this._init(_posX, _posY, _width, _height, _image, _active)
}

function CTextButton(a, b, d, e, h, f, c) {
    var g, p, l;
    this._init = function(a, b, c, d, f, e, h) {
        g = [];
        p = [];
        var n = new createjs.Bitmap(c);
        Math.ceil(h / 20);
        d = new createjs.Text(d, "bold " + h + "px " + f, e);
        d.textAlign = "center";
        f = d.getBounds();
        d.x = c.width / 2;
        d.y = (c.height - f.height) / 2;
        l = new createjs.Container;
        
        l.addChild(n, d);
        s_oStage.addChild(l);
		this.resize(a, b, c);
        this._initListener()
    };
	
	this.resize = function(a, b, c) {
		l.x = a;
        l.y = b;
        l.regX = c.width / 2;
        l.regY = c.height / 2;
	}
	
    this.unload = function() {
        l.off("mousedown");
        l.off("pressup")
    };
    this.setVisible = function(a) {
        l.visible = a
    };
    this._initListener =
        function() {
            l.on("mousedown", this.buttonDown);
            l.on("pressup", this.buttonRelease)
        };
    this.addEventListener = function(a, c, b) {
        g[a] = c;
        p[a] = b
    };
    this.buttonRelease = function() {
        l.scaleX = 1;
        l.scaleY = 1;
        g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(p[ON_MOUSE_UP])
    };
    this.buttonDown = function() {
        l.scaleX = 0.9;
        l.scaleY = 0.9;
        g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(p[ON_MOUSE_DOWN])
    };
    this.setPosition = function(a, c) {
        l.x = a;
        l.y = c
    };
    this.setX = function(a) {
        l.x = a
    };
    this.setY = function(a) {
        l.y = a
    };
    this.getButtonImage = function() {
        return l
    };
    this.getX = function() {
        return l.x
    };
    this.getY = function() {
        return l.y
    };
    this._init(a, b, d, e, h, f, c);
    return this
}