var tutlvl = 0;

var numDataPoints = 500
var heightfield = new Object()
var data = [];

var obstacles = []


function rendertut() {
	if (pogo.frame.body.position[0] < 0) {
		gameOver = true;
		leftplay = false;
		pogo.frame.body.position[0] = Math.max(pogo.frame.body.position[0], -2)
		pogo.frame.body.position[1] = Math.max(pogo.frame.body.position[1], -5)
	}

	// Clear the canvas
	ctx.clearRect(0, 0, w, h);

	if (colorful) {
		ctx.fillStyle = color.sky;
	} else {
		ctx.fillStyle = "#FFFFFF"
	}

	ctx.fillRect(0, 0, w, h);
	ctx.fill()


	// Transform the canvas
	// Note that we need to flip the y axis since Canvas pixel coordinates
	// goes from top to bottom, while physics does the opposite.


	ctx.save();
	xscroll = -pogo.frame.body.position[0]
	v = pogo.frame.body.position[1] - yscroll

	if (Math.abs(v) > 0.35) {
		lerpval = 0.015
	} else {
		lerpval = 0.01
	}

	if (v < -0.2) {
		lerpval = 0.0325
	}
	yscroll = v * lerpval + yscroll
		//	yscroll = Math.max(yscroll, 0)
		//	yscroll = Math.min(yscroll, 1)

	//	ctx.translate(xscroll, 0)

	ctx.translate(w / 2, h / 2); // Translate to the center
	ctx.scale(50, -50); // Zoom in and flip y axis

	ctx.translate(xscroll, -yscroll)
		// Draw all bodies
		// drawbox(pogo.frame);
	ctx.strokeStyle = "#000000";
	drawpogo();

	// drawBox(pogo.frame)
	// drawPlane();
	if (tutlvl > 0) {
		var y = heightfield.body.position[1]
			// y = -1
		var x = heightfield.body.position[0]


		//	x+=xscroll
		// x = 0

		ctx.beginPath();
		ctx.moveTo(x, -h / 50);

		var px = pogo.frame.body.position[0]

		var i = 0;
		for (var d in data) {
			var x1 = i * heightfield.shape.elementWidth
			if (x1 >= px - w / 50 / 2 - 1) {
				ctx.lineTo(x + x1, y + data[i]);
			}
			if (x1 > px + w / 50 / 2 + 2) {
				break;
			}
			i += 1;
		}
		ctx.lineTo(x + data.length - 1 * heightfield.shape.elementWidth, -h / 50)
			// ctx.lineTo(gameWidth/2,gameHeight/2);
			// ctx.lineTo(-gameWidth/2,gameHeight/2);
			// ctx.lineTo(-gameWidth/2,-gameHeight/2);
		ctx.closePath()
		ctx.fillStyle = color.ground
		if (colorful) {
			ctx.fill();
		}
		ctx.stroke();

		if (tutlvl > 1) {
			drawObstacles();
		}
	}

	// Restore transform

	ctx.restore();

	drawControls()

	if (tutlvl > 1) {
		ctx.font = "20px Comic Sans MS";
		ctx.fillStyle = "#555555";
		ctx.textAlign = "center";
		ctx.fillText("Next obstacle: " + Math.floor((rarity * 2) - pogo.frame.body.position[0] % (rarity * 2)), w - 100, h - 20);
	}

	if (tutlvl > 0) {
		if (gameOver) {
			ctx.font = "30px Comic Sans MS";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			if (!pendingquit) {
				score = Math.round(pogo.frame.body.position[0]);
				pendingquit = true
				restarttimer = setTimeout(function () {
					//				return;
					//				if(leftplay) {
					//					leftplay=false;
					//					return;
					//				}
					gameOver = false
					pendingquit = false
					inittut();
				}, 1000 * 3);
			}
			ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 - 40);
		} else {
			ctx.font = "16px Comic Sans MS";
			ctx.fillStyle = "black";
			ctx.textAlign = "left";

			score = Math.round(pogo.frame.body.position[0]);

			ctx.fillText("Score: " + score, 10, 20);
		}
	}
}

function tutnext() {
	tutlvl++
	if (gameOver) {
		leftplay = true;
	}
	if (tutlvl == 1) {
		document.getElementById("lvl0").style.display = 'none'
		document.getElementById("lvl1").style.display = 'block'
	}

	if (tutlvl == 2) {
		document.getElementById("nexttxt").style.display = 'none'
		document.getElementById("lvl1").style.display = 'none'
		document.getElementById("lvl2").style.display = 'block'
	}

	if (tutlvl > 2) {
		document.getElementById("tuthelp").style.display = 'none'
		data = []
		noise.seed(Math.random() * 10);
		data.push(0)

		for (var i = 0; i < numDataPoints; i++) {
			v = i / 10

			var value = noise.simplex2(v, 0);
			var value1 = noise.perlin2(v, 0);
			// data.push(0.5*Math.cos(0.2*i) * Math.sin(0.5*i) + 0.6*Math.sin(0.1*i)
			// * Math.sin(0.05*i));
			data.push(value * 1.75)
		}
		//		nojoystick=oldcontrols.nojoystick
		//		fixedjoy=oldcontrols.fixedjoy
		//		keyboard=oldcontrols.keybiard
		tutlvl = 0;
		gohome()
		return;
	}

	inittut()
}

function inittut() {
	document.getElementById("tutnextb").style.display = 'inline'
	lives = 3
	if (tutlvl > 1) {
		resetHealth()
	}
	gameOver = false
	pendingquit = false
	world = new p2.World({
		gravity: [0, -7]
	});

	if (tutlvl == 0) {
		world.gravity = [0, 0]
	}

	data = []
	noise.seed(Math.random() * 10);
	data.push(0)

	for (var i = 0; i < numDataPoints; i++) {
		v = i / 10

		var value = noise.simplex2(v, 0);
		var value1 = noise.perlin2(v, 0);
		// data.push(0.5*Math.cos(0.2*i) * Math.sin(0.5*i) + 0.6*Math.sin(0.1*i)
		// * Math.sin(0.05*i));
		data.push(value * 1)
	}

	world.defaultContactMaterial.friction = 100;
	world.defaultContactMaterial.restitution = 0.1;


	tut.tutlvl0()
	if (tutlvl > 0) {
		tut.tutlvl1()

		if (tutlvl > 1) {
			tut.tutlvl2()
		}
	}

	if (tutlvl > 0) {
		world.on("beginContact", function (event) {
			if (event.bodyA == pogo.frame.body || event.bodyB == pogo.frame.body) {
				var h = event.bodyA == heightfield.body || event.bodyB == heightfield.body
				if (!h) {
					lives -= 1
					loseHeart()
				} else {
					lives = 0
					loseHeart()
				}
				if (lives <= 0 || h) {
					gameOver = true;
					leftplay = false;
				}

			}
		});
	} else {
		world.on("beginContact", function (event) {
			leftplay = false;
			return true;
		});
	}

}

var tut = {
	tutlvl0: function () {
		pogo = {
			stick: new Object(),
			frame: new Object(),
			spring: null
		};



		pogo.stick.shape = new p2.Box({
			width: 0.25,
			height: 1.6
		});

		pogo.stick.body = new p2.Body({
			mass: 0.25,
			//				damping: 0.2,
			position: [0, 2.75],
			angularVelocity: angularVelocity,
			velocity: [5, 0]
		});

		pogo.frame.shape = new p2.Box({
			width: 0.5,
			height: 1.5,
			sensor: true
		});

		pogo.frame.body = new p2.Body({
			mass: 3,
			position: [0, 3],
			angularVelocity: angularVelocity,
			velocity: [5, 0]
		});

		pogo.frame.body.addShape(pogo.frame.shape);
		pogo.stick.body.addShape(pogo.stick.shape);

		world.addBody(pogo.frame.body);
		world.addBody(pogo.stick.body);

		var c1 = new p2.PrismaticConstraint(pogo.frame.body, pogo.stick.body, {
			localAnchorA: [0, 0.5],
			localAnchorB: [0, 0.5],
			localAxisA: [0, 1],
			disableRotationalLock: true,
		});
		var c2 = new p2.PrismaticConstraint(pogo.frame.body, pogo.stick.body, {
			localAnchorA: [0, 0],
			localAnchorB: [0, 1],
			localAxisA: [0, 1],
			disableRotationalLock: true,
		});
		c1.setLimits(-1, -0.4);
		world.addConstraint(c2);
		world.addConstraint(c1);

		pogo.spring = new p2.LinearSpring(pogo.frame.body, pogo.stick.body, {
			restLength: restLength,
			stiffness: stiffness,
			damping: damping,
			localAnchorA: [0, 0],
			localAnchorB: [0, 0],
		});

		world.addSpring(pogo.spring);

		pogo.frame.shape.collisionGroup = FRAME;
		pogo.stick.shape.collisionGroup = STICK;
		pogo.frame.shape.collisionMask = ~STICK;
		pogo.stick.shape.collisionMask = ~FRAME;
	},
	tutlvl1: function () {
		heightfield.shape = new p2.Heightfield({
			heights: data,
			elementWidth: 2
		});
		heightfield.body = new p2.Body({
			position: [-1, -1]
		});
		heightfield.body.addShape(heightfield.shape);
		world.addBody(heightfield.body);

		heightfield.shape.collisionGroup = GROUND;
		heightfield.shape.collisionMask = -1;
	},
	tutlvl2: function () {
		var OBSTACLE = 8;

		obstacles = []
		for (var i = 5; i < 200; i++) {
			if (i % rarity == 0) {
				if (Math.random() > 0.5) {
					y = data[i] + Math.random() * 2
				} else {
					y = data[i] + 5 - Math.random() * 2
				}

				var circleShape = new p2.Circle({
					radius: 0.5
				});
				var circleBody = new p2.Body({
					mass: 1,
					position: [i * 2, y],
					fixedX: true,
					fixedY: true
				});
				circleBody.addShape(circleShape);
				circleShape.collisionGroup = OBSTACLE;
				//		        circleShape.collisionMask = -1
				obstacles.push(circleBody);
				world.addBody(circleBody);
			}
		}
	}
}
