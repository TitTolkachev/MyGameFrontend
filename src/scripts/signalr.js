class SignalRConnection {
    constructor(ctx) {
        this.ctx = ctx;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://' + this.ctx.BACKEND_HOST + ':' + this.ctx.BACKEND_PORT + '/game')
            .build();
    }

    init() {
        this.initReceive();
        this.initAddPlayers();
        this.initRefreshPlayersList();
        this.start();

        setTimeout(this.registerPlayer.bind(this), 1000);
    }

    initReceive() {
        this.connection.on("Receive", updatePlayerModel.bind(this));
        function updatePlayerModel(model) {

            let p = this.ctx.players.find(item => item.id == model.id);

            if (p.x > model.x + this.ctx.MOTION_VECTOR_SPREAD)
                p.flipX = true;
            else if (p.x + this.ctx.MOTION_VECTOR_SPREAD < model.x)
                p.flipX = false;

            p.targetX = model.x;
            p.targetY = model.y;
            this.ctx.physics.moveTo(
                p,
                model.x,
                model.y,
                this.ctx.MOVE_TO_SPEED
            );
        }
    }

    initAddPlayers() {
        this.connection.on("AddPlayers", addNewPlayers.bind(this));
        function addNewPlayers(newPlayers) {
            newPlayers.forEach(element => {
                this.ctx.loadPlayer(element.id, element.x, element.y, this.ctx.SPRITE_WIDTH, "luigi");
            });
        }
    }

    initRefreshPlayersList() {
        this.connection.on("RefreshPlayersList", refreshPlayersList.bind(this));
        function refreshPlayersList(playersList) {
            if (this.ctx.player.id)
                this.connection.invoke("RefreshPlayer", { x: this.ctx.player.x, y: this.ctx.player.y, id: this.ctx.player.id });
            this.ctx.players.forEach(p => {
                if (p.id != this.ctx.player.id && !playersList.find(plr => plr.id == p.id)) {
                    p.destroy(this.ctx.players);
                }
            });
        }
    }

    start() {
        this.connection.start()
            .catch(function (err) {
                return console.error(err.toString());
            });
    }

    registerPlayer() {
        this.connection.on("PlayerId", initPlayerId.bind(this))
        function initPlayerId(id) {
            this.ctx.player.id = id;
            this.connection.invoke("RegisterPlayer", { x: this.ctx.player.x, y: this.ctx.player.y, id: this.ctx.player.id });
        }
        this.connection.invoke("GeneratePlayerId");
    }

    movePlayer(x, y, id) {
        if (id)
            this.connection.invoke("MovePlayer", { x: x, y: y, id: id });
    }
}