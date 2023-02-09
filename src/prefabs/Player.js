class Player extends Entity {
    constructor(ctx, id, width, key) {
        super(ctx, id, width, key);
    }

    move() {
        let x = 0, y = 0;

        if (this.ctx.cursors.down.isDown) {
            y += 56;
        }
        if (this.ctx.cursors.right.isDown) {
            x += 56;
        }
        if (this.ctx.cursors.up.isDown) {
            y -= 56;
        }
        if (this.ctx.cursors.left.isDown) {
            x -= 56;
        }
        this.moveTo(x, y);
    }
    moveTo(deltaX, deltaY) {
        if (deltaX != 0 || deltaY != 0)
            this.ctx.backend.movePlayer(this.spr.x + deltaX, this.spr.y + deltaY);
    }
}