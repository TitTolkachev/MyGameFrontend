class Player extends Entity {
    constructor(scene, id, x, y, width, depth, key) {
        super(scene, id, x, y, width, depth, key);
    }

    move() {
        let x = 0, y = 0;

        if (this.scene.cursors.down.isDown) {
            y += 56;
        }
        if (this.scene.cursors.right.isDown) {
            x += 56;
        }
        if (this.scene.cursors.up.isDown) {
            y -= 56;
        }
        if (this.scene.cursors.left.isDown) {
            x -= 56;
        }
        this.moveTo(x, y);
    }
    moveTo(deltaX, deltaY) {
        if (deltaX != 0 || deltaY != 0)
            this.scene.backend.movePlayer(this.x + deltaX, this.y + deltaY, this.id);
    }
}