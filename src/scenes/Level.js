
class Level extends Phaser.Scene {

	constructor() {
		super("Level");
	}

	init() {
		this.DEPTH = {
			floor: 0,
			player: 1,
			projectile: 2
		}

		this.PLAYER_SPRITE_WIDTH = 100;
		this.PROJECTILE_SPRITE_WIDTH = 50;

		this.PROJECTILE_COLLIDER_WIDTH = 5;
		this.PROJECTILE_COLLIDER_HEIGHT = 5;
		this.PROJECTILE_VX = 0;
		this.PROJECTILE_VY = 0;

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
		this.createPlayer(400, 400, this.PLAYER_SPRITE_WIDTH);

		// Groups
		this.projectiles = [];

		// Hub Connection
		this.backend = new SignalRConnection(this);
		this.backend.init();

		// Player (components)
		//new PushOnClick(this.player);

		this.initEventListeners();

		this.events.emit("scene-awake");
	}

	create() {
		this.editorCreate();

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

	initEventListeners() {
		this.cursors = this.input.keyboard.createCursorKeys();

		this.input.keyboard.on("keydown-SPACE", this.player.shoot.bind(this), this);
		// console.log(this.input.keyboard.eventNames());

		// При сворачивании окна поставить меню паузы с кнопкой вернуться, удалить все объекты и заново все проинициализировать
		document.addEventListener("visibilitychange", function(){
			if (document.hidden){
				console.log('Вкладка не активна');
			} else {
				console.log('Вкладка активна');    
			}
		});
	}

	createPlayer(x, y, width) {
		this.player = new Player(this, false, x, y, width, this.DEPTH.player, 'mario');
		//this.player.startNewAnim('walk');
		this.players.push(this.player);
	}

	loadPlayer(id, x, y, width) {
		let p = new Player(this, id, x, y, width, this.DEPTH.player, 'luigi');
		//p.startNewAnim('walk');
		this.players.push(p);
	}
	
	loadProjectile(id, ownerId, x, y, vx, vy) {
		new Projectile(this, id, ownerId, x, y, vx, vy, this.PROJECTILE_SPRITE_WIDTH, 
			this.PROJECTILE_COLLIDER_WIDTH, this.PROJECTILE_COLLIDER_HEIGHT, this.DEPTH.projectile, 'coin-projectile');
		//p.startNewAnim('walk');
	}
}