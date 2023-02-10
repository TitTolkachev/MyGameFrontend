
class Level extends Phaser.Scene {

	constructor() {
		super("Level");
	}

	init() {
		this.DEPTH = {
			floor: 0,
			player: 1
		}
		this.SPRITE_WIDTH = 100;
		this.MOTION_VECTOR_SPREAD = 30;
		this.MOVE_TO_SPEED = 400;
		this.BACKEND_HOST = 'localhost';
		this.BACKEND_PORT = '7070';
	}

	/** @returns {void} */
	editorCreate() {

		this.init();

		// Player
		this.players = [];
		this.createPlayer(400, 400, this.SPRITE_WIDTH);

		// Hub Connection
		this.backend = new SignalRConnection(this);
		this.backend.init();

		// Player (components)
		//new PushOnClick(this.player);

		this.events.emit("scene-awake");
	}

	create() {
		this.editorCreate();

		this.cursors = this.input.keyboard.createCursorKeys();
		this.frameTime = 0;
	}

	update(time, delta) {

		this.frameTime += delta

		if (this.frameTime > 50) {
			this.frameTime = 0;

			this.player.move();
		}

		// Фикс бага движка, когда персонаж не останавливается, достигнув цели
		this.players.forEach(p =>
			p.checkVelocity()
		);
	}

	createPlayer(x, y, width) {
		this.player = new Player(this, false, width, 'mario');
		this.player.createSprite(x, y);
		//this.player.startNewAnim('walk');
		this.player.setDepth(this.DEPTH.player);
		this.players.push(this.player);
	}

	loadPlayer(id, x, y, width) {
		let p = new Player(this, id, width, 'luigi');
		p.createSprite(x, y);
		//p.startNewAnim('walk');
		p.setDepth(this.DEPTH.player);

		this.players.push(p);
	}
}