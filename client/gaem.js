'use strict';

class Item {
  constructor(image, xImage, yImage, width, height) {
    this.image = image;
    this.xImage = xImage;
    this.yImage = yImage;
    this.width = width;
    this.height = height;
  }
  draw(xPosition, yPosition) {
    ctx.drawImage(this.image, this.xImage, this.yImage, this.width, this.height, xPosition, yPosition, 32, 32);
  }
}
Item.list = {};

class Player {
  constructor(pack) {
    this.number = pack.number;
    this.x = pack.x;
    this.y = pack.y;
    this.sprite = Sprite.list['Character' + pack.being];
    this.sprite = new Sprite(this.sprite.image,this.sprite.width,this.sprite.height,this.sprite.rowLength,this.sprite.inverse);
    Player.list[this.number] = this;
  }
}
Player.list = {};

class Mob {
  constructor(pack) {
    this.number = pack.number;
    this.x = pack.x;
    this.y = pack.y;
    this.sprite = Sprite.list[pack.being];
    this.sprite = new Sprite(this.sprite.image,this.sprite.width,this.sprite.height,this.sprite.rowLength,this.sprite.inverse);
    Mob.list[this.number] = this;
  }
}
Mob.list = {};

class Button {
  constructor(image, xStart, xEnd, yStart, yEnd, funct) {
		this.image = image;
		this.xStart = xStart;
    this.xEnd = xEnd;
    this.yStart = yStart;
    this.yEnd = yEnd;
    this.funct = funct;
  }
  isClicked(xPosition, yPosition) {
    if (xPosition > this.xStart && xPosition < this.xEnd && yPosition > this.yStart && yPosition < this.yEnd) {
      innerButtons = [];
      ctx.fillStyle = 'rgba(206,255,255,1)';
      ctx.fillRect(500, 0, 200, 500);
      this.funct();
      drawButtons();
    }
  }
  draw() {
		if (typeof this.image === 'string'){
			ctx.font = (this.yEnd - this.yStart)* + 'px Ariel';
			ctx.fillStyle = "black";
			ctx.fillText(this.image, this.xStart, this.yEnd)
		}
		else{
			ctx.drawImage(this.image, 0, 0, this.xEnd - this.xStart, this.yEnd - this.yStart, this.xStart, this.yStart,this.xEnd - this.xStart, this.yEnd - this.yStart);
		}
	}
}

class Sprite {
  constructor(image, width, height, rowLength, inverse) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.index = 0;
    this.row = 0;
    this.rowLength = rowLength;
    this.framesOn = 0;
    this.inverse = inverse;
    this.reverse = 1;
  }
  draw(xPosition, yPosition) {
    ctx.save();
    if (this.reverse * this.inverse === -1)
      ctx.scale(-1, 1);
    ctx.drawImage(this.image, this.width * this.index, this.height * this.row, this.width, this.height, this.reverse * this.inverse * (xPosition - this.width * 3 / 2), yPosition - this.height * 3 / 2, this.reverse * this.inverse * this.width * 3, this.height * 3);
    ctx.restore();
    if (this.framesOn >= 60 / this.rowLength) {
      this.index++;
      this.framesOn = 0;
    }
    this.framesOn++;
    if (this.index > this.rowLength - 1)
      this.index = 0;
  }
}
Sprite.list = {};
function imageMaker(source){
	var image = new Image();
	image.src = source;
	return image;
}

var socket = io();
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');
var signDivMap = document.getElementById('signDiv-map');
var playerType = document.getElementById('playerType');
document.addEventListener('click', onClick);
var innerButtons = [];
var inventory = [];
var dooDads = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var images = [
  { image: 'img/CharacterKnight.png', size: 32, inverse: 1 },
  { image: 'img/CharacterWizard.png', size: 32, inverse: 1 },
  { image: 'img/CharacterThief.png', size: 32, inverse: 1 },
  { image: 'img/CharacterShaman.png', size: 32, inverse: 1 },
  { image: 'img/mob9.png', size: 32, inverse: 1 },
  { image: 'img/mob8.png', size: 48, inverse: -1 },
  { image: 'img/mob7.png', size: 32, inverse: 1 },
  { image: 'img/mob6.png', size: 32, inverse: 1 },
  { image: 'img/mob5.png', size: 32, inverse: 1 },
  { image: 'img/mob4.png', size: 32, inverse: 1 },
  { image: 'img/mob3.png', size: 32, inverse: 1 },
  { image: 'img/mob2.png', size: 32, inverse: -1 },
  { image: 'img/mob1.png', size: 32, inverse: -1 }
];
var itemImages = [
  { image: 'img/items.png', size: 32, rowLength: 16, total: 150 }
];
var buttonImages = [
	{ image: imageMaker('img/InventoryIcon.png')},
	{ image: imageMaker('img/MapIcon.png')},
	{ image: imageMaker('img/OptionsIcon.png')},
	{ image: imageMaker('img/MarketIcon.png')},
	{ image: imageMaker('img/DoodadIcon.png')},
	{ image: imageMaker('img/InformationIcon.png')},
	{ image: imageMaker('img/MultiplayerIcon.png')},
	{ image: imageMaker('img/EquipmentIcon.png')}
]
var menuButtons = [
  new Button(buttonImages[1].image,500,550,0,50,openMap),
	new Button(buttonImages[4].image,550,600,0,50,temp),
  new Button(buttonImages[0].image,600,650,0,50,drawInventory),
	new Button(buttonImages[7].image,650,700,0,50,temp),
	new Button(buttonImages[6].image,500,550,450,500,temp),
	new Button(buttonImages[3].image,550,600,450,500,temp),
	new Button(buttonImages[5].image,600,650,450,500,temp),
	new Button(buttonImages[2].image,650,700,450,500,temp)
];
var itemHash = {
  mob1: [
    { item: 13, image: 0 },
    { item: 0, image: 0 },
    { item: 1, image: 0 },
    { item: 2, image: 0 }
  ],
  mob2: [
    { item: 29, image: 0 }
  ],
  mob3: [
    { item: 45, image: 0 }
  ],
  mob4: [
    { item: 57, image: 0 }
  ],
  mob5: [
    { item: 93, image: 0 }
  ],
  mob6: [
    { item: 109, image: 0 }
  ],
  mob7: [
    { item: 60, image: 0 }
  ],
  mob8: [
    { item: 76, image: 0 }
  ],
  mob9: [
    { item: 92, image: 0 }
  ]
};
var imageLoader = function(i) {
  var imageItem = new Image();
  imageItem.src = itemImages[i].image;
  imageItem.addEventListener('load', function() {
    if (i < itemImages.length - 1)
      imageLoader(i + 1);
  });
}
var itemLoader = function() {
  for (var i in itemHash) {
    for (var j = 0; j < itemHash[i].length; j++) {
      var curr = itemHash[i][j];
      var currImage = new Image()
      currImage.src = itemImages[curr.image].image;
      var currSize = itemImages[curr.image].size;
      var currRowSize = itemImages[curr.image].rowLength;
      Item.list[i + 'item' + j] = new Item(currImage,curr.item % currRowSize * currSize,Math.floor(curr.item / currRowSize) * currSize,currSize,currSize);
    }
  }
}
var spriteLoader = function(i) {
  var image = new Image();
  image.src = images[i].image;
  image.addEventListener('load', function() {
    Sprite.list[image.src.substring(image.src.indexOf('img') + 4, image.src.length - 4)] = new Sprite(image,images[i].size,images[i].size,10,images[i].inverse);
    if (i < images.length - 1)
      spriteLoader(i + 1);
  });
}
imageLoader(0);
itemLoader();
spriteLoader(0);

signDivSignIn.onclick = function() {
  if (playerType.elements['playerTypes'].value)
    socket.emit('signIn', {
      username: signDivUsername.value,
      password: signDivPassword.value
    });
}
signDivSignUp.onclick = function() {
  socket.emit('signUp', {
    username: signDivUsername.value,
    password: signDivPassword.value
  });
}
socket.on('signInResponse', function(data) {
  if (data.success) {
    signDiv.style.display = 'none';
    gameDiv.style.display = 'inline-block';
    ctx.fillStyle = 'rgba(206,255,255,1)';
    ctx.fillRect(500, 0, 200, 500);
    drawButtons();
    var last = new Image();
    last.src = 'img/mob1.png';
    last.addEventListener('load', function() {
      socket.emit('loaded', {
        playerType: playerType.elements['playerTypes'].value,
        map: signDivMap.value
      });
    });
  }
  else
    alert('Sign in failed');
});
socket.on('signUpResponse', function(data) {
  if (data.success) {
    alert('Sign up successful');
  }
  else
    alert('Sign up failed');
});

var ctx = document.getElementById('ctx').getContext('2d');
ctx.imageSmoothingEnabled = false;
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
ctx.font = '30px Ariel';
var positions;
socket.on('newPosition', function(data) {
  positions = data;
});

socket.on('addToChat', function(data) {
  chatText.innerHTML += '<div>' + data + '</div>';
});

chatForm.onsubmit = function(e) {
  e.preventDefault();
  socket.emit('sendText', chatInput.value);
  chatInput.value = '';
}

socket.on('init', function(data) {
  for (var i in data.players) {
    new Player(data.players[i]);
  }
  for (var i in data.mobs) {
    new Mob(data.mobs[i]);
  }
});
socket.on('update', function(data) {
  for (var i in data.players) {
    Player.list[data.players[i].number].x = data.players[i].x;
    Player.list[data.players[i].number].y = data.players[i].y;
  }
  for (var i in data.mobs) {
    Mob.list[data.mobs[i].number].x = data.mobs[i].x;
    Mob.list[data.mobs[i].number].y = data.mobs[i].y;
  }
});
socket.on('remove', function(data) {
  for (var i in data.players) {
    delete Player.list[data.players[i].number];
  }
  for (var i in data.mobs) {
    delete Mob.list[data.mobs[i].number];
  }
});
socket.on('changeRow', function(data) {
  for (var i in data.players) {
    Player.list[data.players[i].number].sprite.index = 0;
    Player.list[data.players[i].number].sprite.framesOn = 0;
    Player.list[data.players[i].number].sprite.row = data.players[i].row;
    if (data.players[i].reverse)
      Player.list[data.players[i].number].sprite.reverse = data.players[i].reverse;
  }
  for (var i in data.mobs) {
    Mob.list[data.mobs[i].number].sprite.index = 0;
    Mob.list[data.mobs[i].number].sprite.framesOn = 0;
    Mob.list[data.mobs[i].number].sprite.row = data.mobs[i].row;
    if (data.mobs[i].reverse)
      Mob.list[data.mobs[i].number].sprite.reverse = data.mobs[i].reverse;
  }
});

function drawButtons() {
  for (var i = 0; i < menuButtons.length; i++) {
    menuButtons[i].draw();
  }
  for (var i = 0; i < innerButtons.length; i++) {
    innerButtons[i].draw();
  }
}
function onClick(e) {
  var xPosition = e.pageX - gameDiv.offsetLeft;
  var yPosition = e.pageY - gameDiv.offsetTop;
  for (var i = 0; i < menuButtons.length; i++) {
    menuButtons[i].isClicked(xPosition, yPosition);
  }
  for (var i = 0; i < innerButtons.length; i++) {
    innerButtons[i].isClicked(xPosition, yPosition);
  }
}
function temp() {
	console.log('Button was pressed.');
}
function openMap() {
  innerButtons.push(new Button('level 1',550,650,30,60,function() {
    socket.emit('changeDifficulty', {
      difficulty: 1
    })
  }
  ));
  innerButtons.push(new Button('level 2',550,650,80,110,function() {
    socket.emit('changeDifficulty', {
      difficulty: 2
    })
  }
  ));
  innerButtons.push(new Button('level 3',550,650,130,160,function() {
    socket.emit('changeDifficulty', {
      difficulty: 3
    })
  }
  ));
  innerButtons.push(new Button('level 4',550,650,180,210,function() {
    socket.emit('changeDifficulty', {
      difficulty: 4
    })
  }
  ));
  innerButtons.push(new Button('level 5',550,650,230,260,function() {
    socket.emit('changeDifficulty', {
      difficulty: 5
    })
  }
  ));
  innerButtons.push(new Button('level 6',550,650,280,310,function() {
    socket.emit('changeDifficulty', {
      difficulty: 6
    })
  }
  ));
  innerButtons.push(new Button('level 7',550,650,330,360,function() {
    socket.emit('changeDifficulty', {
      difficulty: 7
    })
  }
  ));
  innerButtons.push(new Button('level 8',550,650,380,410,function() {
    socket.emit('changeDifficulty', {
      difficulty: 8
    })
  }
  ));
  innerButtons.push(new Button('level 9',550,650,430,460,function() {
    socket.emit('changeDifficulty', {
      difficulty: 9
    })
  }
  ));
}

function drawInventory() {
  for (var i = 0; i < inventory.length; i++) {
    inventory[i].draw(500 + i % 6 * 32, Math.floor(i / 6) * 32 + 50);
  }
}
function drawDooDads() {
  yValue = 0;
  for (var i in itemHash) {
    itemHash[i][0].draw(500, yValue * 32 + 20);
    ctx.fillText(dooDads[yValue], 532, yValue * 32 + 20);
    yValue++;
  }
}
socket.on('addItem', function(data) {
  var rand = Math.floor(Math.random() * itemHash[data.being].length);
  //rand < 1 ? dooDads[data.being.substring(data.being.length - 1)]++:
  inventory.push(Item.list[data.being + 'item' + rand]);
});

setInterval(function() {
  ctx.clearRect(0, 0, 500, 500);
  for (var i in Player.list) {
    Player.list[i].sprite.draw(Player.list[i].x, Player.list[i].y);
  }
  for (var i in Mob.list) {
    Mob.list[i].sprite.draw(Mob.list[i].x, Mob.list[i].y);
  }
}, 1000 / 60);
