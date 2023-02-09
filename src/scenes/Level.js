
class Level extends Phaser.Scene {

	constructor() {
		super("Level");

	}

	/** @returns {void} */
	editorCreate() {

		// Constatns
		this.SPRITE_WIDTH = 100;
		this.MOTION_VECTOR_SPREAD = 30;

		// Player
		this.player = this.add.image(400, 400, "mario");
		this.player.displayWidth = this.SPRITE_WIDTH;
		this.player.scaleY = this.player.scaleX;
		this.physics.add.existing(this.player);
		this.players = [];
		// authority: null - показывает, что это персонаж клиента
		this.players.push({ image: this.player, authority: null, targetX: null, targetY: null });

		// player (components)
		//new PushOnClick(this.player);

		this.events.emit("scene-awake");
	}

	create() {
		this.editorCreate();

		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:7070/game")
			.build();

		this.hubConnection.on("Receive", updatePlayerModel.bind(this));
		function updatePlayerModel(model) {
			let p = this.players.find(item => item.authority == model.authority);

			// this.tweens.add({
			// 	targets: this.players.find(item => item.authority == model.authority).image,
			// 	x: model.x,
			// 	y: model.y,
			// 	duration: 25
			//   });

			if (p.image.x > model.x + this.MOTION_VECTOR_SPREAD)
				p.image.flipX = true;
			else if (p.image.x + this.MOTION_VECTOR_SPREAD < model.x)
				p.image.flipX = false;

			p.targetX = model.x;
			p.targetY = model.y;
			this.physics.moveTo(
				p.image,
				model.x,
				model.y,
				400
			);
		}

		this.hubConnection.on("AddPlayers", addNewPlayers.bind(this));
		function addNewPlayers(newPlayers) {
			newPlayers.forEach(element => {
				let p = this.add.sprite(element.x, element.y, "luigi");
				p.displayWidth = this.SPRITE_WIDTH;
				p.scaleY = p.scaleX;
				this.players.push({ image: p, authority: element.authority, targetX: null, targetY: null });
				this.physics.add.existing(p);
			});
		}

		this.hubConnection.on("RefreshPlayersList", refreshPlayersList.bind(this));
		function refreshPlayersList(playersList) {
			this.hubConnection.invoke("RefreshPlayer", { x: this.player.x, y: this.player.y });
			this.players.forEach(p => {
				if (p.authority != null && !playersList.find(plr => plr.authority == p.authority)) {
					p.image.destroy();
					this.players.splice(this.players.indexOf(p), 1);
				}
			});
		}


		this.hubConnection.start()
			.catch(function (err) {
				return console.error(err.toString());
			});

		setTimeout(() => {
			this.hubConnection.invoke("RegisterPlayer", { x: this.player.x, y: this.player.y });
		}, 1000);

		this.cursors = this.input.keyboard.createCursorKeys();
		this.frameTime = 0;
	}

	update(time, delta) {

		this.frameTime += delta

		if (this.frameTime > 50) {
			this.frameTime = 0;

			let x = 0, y = 0;

			if (this.cursors.down.isDown) {
				//this.player.y += 12;
				y += 56;
				//this.hubConnection.invoke("MovePlayer", this.player.x, this.player.y + 24);
			}
			if (this.cursors.right.isDown) {
				//this.player.x += 12;
				x += 56;
				//this.hubConnection.invoke("MovePlayer", this.player.x + 24, this.player.y);
			}
			if (this.cursors.up.isDown) {
				//this.player.y -= 12;
				y -= 56;
				//this.hubConnection.invoke("MovePlayer", this.player.x, this.player.y - 24);
			}
			if (this.cursors.left.isDown) {
				//this.player.x -= 12;
				x -= 56;
				//this.hubConnection.invoke("MovePlayer", this.player.x - 24, this.player.y);
			}
			if (x != 0 || y != 0)
				this.hubConnection.invoke("MovePlayer", this.player.x + x, this.player.y + y);
		}

		// Фикс бага движка, когда персонаж не останавливается, достигнув цели
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
	}
}