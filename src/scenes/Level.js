
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// Player
		this.player = this.add.image(400, 400, "dino");
		this.physics.add.existing(this.player);

		// player (components)
		//new PushOnClick(this.player);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.editorCreate();


		this.players = [];


		// Hub Connection
		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:7070/game")
			.build();

		// получение данных с сервера
		this.hubConnection.on("Receive", updatePlayerModel.bind(this));

		function updatePlayerModel(model) {
			let p = this.players.find(item => item.authority == model.authority);
			//p.image.body.velocity.x = 0;
			//p.image.body.velocity.y = 0;
			//p.image.x = p.targetX;
			//p.image.y = p.targetY;

			p.targetX = model.x;
			p.targetY = model.y;
			this.physics.moveTo(
				p.image,
				model.x,
				model.y,
				800, // speed
				80// maxTimeToFinish(ms) - скорость изменения вектора скорости
			);
		}

		this.hubConnection.on("AddPlayers", addNewPlayers.bind(this));

		function addNewPlayers(newPlayers) {
			newPlayers.forEach(element => {
				let p = this.add.sprite(element.x, element.y, "dino");
				this.players.push({ image: p, authority: element.authority, targetX: null, targetY: null });
				this.physics.add.existing(p);
			});
		}


		this.hubConnection.start()
			.catch(function (err) {
				return console.error(err.toString());
			});

		setTimeout(() => {
			this.hubConnection.invoke("RegisterPlayer", { "ConnectionId": "", "PlayerIndex": 0 });
		}, 1000);

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {

		this.players.forEach(p => {
			if (p.targetX || p.targetY) {
				if (p.image.body.velocity.x > 0 && p.image.x > p.targetX ||
					p.image.body.velocity.x < 0 && p.image.x < p.targetX ||
					p.image.body.velocity.y < 0 && p.image.y < p.targetY ||
					p.image.body.velocity.y > 0 && p.image.y > p.targetY) {
					p.image.body.velocity.x = 0;
					p.image.body.velocity.y = 0;
					p.image.x = p.targetX;
					p.image.y = p.targetY;
					p.targetX = null;
					p.targetY = null;
				}
			}
		});

		if (this.cursors.down.isDown) {
			this.player.y += 5;
			this.hubConnection.invoke("MovePlayer", this.player.x, this.player.y);
		}
		if (this.cursors.right.isDown) {

			this.player.x += 5;
			this.hubConnection.invoke("MovePlayer", this.player.x, this.player.y);
		}
		if (this.cursors.up.isDown) {

			this.player.y -= 5;
			this.hubConnection.invoke("MovePlayer", this.player.x, this.player.y);
		}
		if (this.cursors.left.isDown) {
			this.player.x -= 5;
			this.hubConnection.invoke("MovePlayer", this.player.x, this.player.y);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
