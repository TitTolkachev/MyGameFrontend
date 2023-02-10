class Player extends Entity {
    constructor(scene, id, x, y, width, depth, key) {
        super(scene, id, x, y, width, depth, key);

        if (this.scene.projectiles)
            this.scene.projectiles.forEach(projectile => {
                this.scene.physics.add.overlap(this, projectile, () => console.log("Overlap!!!"));
                this.scene.physics.add.collider(this, projectile, () => console.log("Collision!!!"));
            });
        if (this.scene.players)
            this.scene.players.forEach(player => {
                this.scene.physics.add.overlap(this, player, () => console.log("Overlap!!!"));
                this.scene.physics.add.collider(this, player, () => console.log("Collision!!!"));
            });

        this.nextShotId = 1;
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
    shoot() {
        this.backend.addProjectile(this.player.nextShotId++, this.player.id, this.player.x, this.player.y, this.PROJECTILE_VX, this.PROJECTILE_VY);
    }
}