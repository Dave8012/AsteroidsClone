/*JavaScript for Asteroids game
David Schmeling

 ----- To do -----
** Add levels that get harder/faster
* Change the colors on canvas
* Change Text Color/Font and what it says

 ----- Previous Changes -----
 - Fixed size and position of canvas to fit the screen
 - Added use for arrow keys instead of just WASD
 - Fixed the respawn immediate loss by removing asteroid that hits user in center
 - Added controls/more info to screen
 - Game can now be properly reset after loss
*/

let canvas;
let ctx;
let canvasWidth;
let canvasHeight;
let ship;
let keys;
let bullets;
let asteroids;
let score;
let lives;
let level;

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas(){
	canvas = document.getElementById('my-canvas');
	ctx = canvas.getContext("2d");
	canvasWidth = 1400;
	canvasHeight = 1000;
	keys = [];
	bullets = [];
	asteroids = [];
	score = 0;
	lives = 3;
	level = 1;
	
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ship = new Ship();
	
	for(let i = 0; i < 6; i++){
		asteroids.push(new Asteroid());
	}
	//Getting the keycode for the key that the user pressed
	document.body.addEventListener("keydown", HandleKeyDown);
	document.body.addEventListener("keyup", HandleKeyUp);
	Render();
}

function HandleKeyDown(e){
	keys[e.keyCode] = true;
}

function HandleKeyUp(e){
	keys[e.keyCode] = false;
	if(e.keyCode === 32){
		bullets.push(new Bullet(ship.angle));
	}
}

class Ship{
	constructor(){
		this.visible = true;
		this.x = canvasWidth / 2;
		this.y = canvasHeight / 2;
		this.movingForward = false;
		this.speed = 0.1;
		this.velX = 0;
		this.velY = 0;
		this.rotateSpeed = 0.001;
		this.radius = 15;
		this.angle = 0;
		this.strokeColor = 'white';
		this.noseX = canvasWidth / 2 + 15;
		this.noseY = canvasHeight / 2;
	}
	
	Rotate(dir){
		this.angle += this.rotateSpeed * dir;
	}
	
	Update(){
		let radians = this.angle / Math.PI * 180;
		if(this.movingForward){
			this.velX += Math.cos(radians) * this.speed;
			this.velY += Math.sin(radians) * this.speed;
		}
		if(this.x < this.radius){
			this.x = canvas.width;
		}
		if(this.x > canvas.width){
			this.x = this.radius;
		}
		if(this.y < this.radius){
			this.y = canvas.height;
		}
		if(this.y > canvas.height){
			this.y = this.radius;
		}
		this.velX *= 0.99;
		this.velY *= 0.99;
		
		this.x -= this.velX;
		this.y -= this.velY;
	}
	
	Draw(){
		ctx.strokeStyle = this.strokeColor;
		ctx.beginPath();
		let vertAngle = ((Math.PI * 2) / 3);
		let radians = this.angle / Math.PI * 180;
		this.noseX = this.x - this.radius * Math.cos(radians);
		this.noseY = this.y - this.radius * Math.sin(radians);
		for(let i = 0; i < 3; i++){
			ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians),
			this.y - this.radius * Math.sin(vertAngle * i + radians));
		}
		ctx.closePath();
		ctx.stroke();
	}
}

class Bullet{
	constructor(angle){
		this.visible = true;
		this.x = ship.noseX;
		this.y = ship.noseY;
		this.angle = angle;
		this.height = 4;
		this.width = 4;
		this.speed = 5;
		this.velX = 0;
		this.velY = 0;
	}
	Update(){
		var radians = this.angle / Math.PI * 180;
		this.x -= Math.cos(radians) * this.speed;
		this.y -= Math.sin(radians) * this.speed;
	}
	Draw(){
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class Asteroid{
	constructor(x, y, radius, level, collisionRadius){
		this.visible = true;
		this.x = x || Math.floor(Math.random() * canvasWidth);
		this.y = y || Math.floor(Math.random() * canvasHeight);
		this.speed = 3;
		this.radius = radius || 50;
		this.angle = Math.floor(Math.random() * 359);
		this.strokeColor = 'white';
		this.collisionRadius = collisionRadius || 46;
		this.level = level || 1;
	}
	Update(){
		var radians = this.angle / Math.PI * 180;
		this.x += Math.cos(radians) * this.speed;
		this.y += Math.sin(radians) * this.speed;
		if(this.x < this.radius){
			this.x = canvas.width;
		}
		if(this.x > canvas.width){
			this.x = this.radius;
		}
		if(this.y < this.radius){
			this.y = canvas.height;
		}
		if(this.y > canvas.height){
			this.y = this.radius;
		}
	}
	Draw(){
		ctx.beginPath();
		let vertAngle = ((Math.PI * 2) / 6);
		var radians = this.angle / Math.PI * 180;
		for(let i = 0; i < 6; i++){
			ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians),
			this.y - this.radius * Math.sin(vertAngle * i + radians));
		}
		ctx.closePath();
		ctx.stroke();
	}
}

function CircleCollision(p1x, p1y, r1, p2x, p2y, r2){
	let radiusSum;
	let xDiff;
	let yDiff;
	radiusSum = r1 + r2;
	xDiff = p1x - p2x;
	yDiff = p1y - p2y;
	if(radiusSum > Math.sqrt((xDiff * xDiff)+(yDiff * yDiff))){
		return true;
	} else {
		return false;
	}
}

function DrawLifeShips(){
	let startX = 1350;
	let startY = 25;
	let points = [[9,9], [-9,9]];
	ctx.strokeStyle = 'white';
	for(let i = 0; i < lives; i++){
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		for(let j = 0; j < points.length; j++){
			ctx.lineTo(startX + points[j][0], startY + points[j][1]);
		}
		ctx.closePath();
		ctx.stroke();
		startX -= 30;
	}
}

function Render(){
	// --- Movement of user ---
	ship.movingForward = (keys[87] || keys[38]);
	if(keys[68] || keys[39]){
		ship.Rotate(1);
	}
	if(keys[65] || keys[37]){
		ship.Rotate(-1);
	}
	
	// --- Rendering the canvas/text ---
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	ctx.fillStyle = 'white';
	ctx.font = '21px Arial';
	ctx.fillText('SCORE : ' + score.toString(), 20, 35);
	ctx.fillText('LEVEL : ' + level.toString(), 200, 35);
	ctx.fillText('ASTEROIDS CLONE : DAVID SCHMELING', canvasWidth / 2 - 200, 35);
	ctx.fillText('MOVE : WASD/Arrow Keys | SHOOT : Space Bar', canvasWidth / 2 - 225, 70);
	ctx.fillText('LIVES LEFT : ', 1125, 35);
	
	// --- Game over splashscreen, option to start new game ---
	if(lives <= 0){
		ship.visible = false;
		ctx.fillStyle = 'white';
		ctx.font = '50px Arial';
		ctx.fillText('GAME OVER!', canvasWidth / 2 - 150, canvasHeight / 2);
		ctx.font = '25px Arial';
		ctx.fillText('FINAL SCORE : ' + score.toString(), canvasWidth / 2 - 105, canvasHeight / 2 + 75);
		ctx.fillText('Press P to Play Again!', canvasWidth / 2 - 115, canvasHeight / 2 + 150);
		//Start new game
		if(keys[80]){
			SetupCanvas();
			return;
		}
	}
	DrawLifeShips();
	
	// --- Asteroid collision with ship ---
	if(asteroids.length !== 0){
		for(let k = 0; k < asteroids.length; k++){
			if(CircleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)){
				ship.x = canvasWidth / 2;
				ship.y = canvasHeight / 2;
				ship.velX = 0;
				ship.velY = 0;
				lives -= 1;
				//Asteroid removed to reduce imediate respawn death if in center
				asteroids.splice(k, 1);
			}
		}
	}
	
	// --- Increasing level/asteroids WORK IN PROGRESS --- 
	if(asteroids.length === 0){
		level = level + 1;
		let increase = (level - 1) * 2;
		for(let i = 0; i < 6 + increase; i++){
			asteroids.push(new Asteroid());
		}
	}
	
	// --- Bullet collision with asteroids ---
	if(asteroids.length !== 0 && bullets.length !== 0){
	loop1:
		for(let l = 0; l < asteroids.length; l++){
			for(let m = 0; m < bullets.length; m++){
				if(CircleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)){
					if(asteroids[l].level === 1){
						asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
						asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
					}else if(asteroids[l].level === 2){
						asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
						asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
					}
					asteroids.splice(l, 1);
					bullets.splice(m, 1);
					score += 10;
					break loop1;
				}
			}
		}
	}
	
	// --- Updating and drawing all elements ---
	
	if(ship.visible){
		ship.Update();
		ship.Draw();
	}
	if(bullets.length !== 0){
		for(let i = 0; i < bullets.length; i++){
			bullets[i].Update();
			bullets[i].Draw();
		}
	}
	if(asteroids.length !== 0){
		for(let j = 0; j < asteroids.length; j++){
			asteroids[j].Update();
			asteroids[j].Draw(j);
		}
	}
	requestAnimationFrame(Render);
}
