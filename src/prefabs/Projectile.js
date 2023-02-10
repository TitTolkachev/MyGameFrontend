class Projectile extends Entity {
    constructor(scene, id, ownerId, x, y, vx, vy, width, colliderWidth, colliderHeight, depth, key) {
        super(scene, id, x, y, width, depth, key);

        this.ownerId = ownerId;
        // this.damage = 10;

        this.body.setSize(colliderWidth, colliderHeight);
        this.body.velocity.x = vx;
        this.body.velocity.y = vy;
        this.scene.projectiles.push(this);

        if (this.scene.players)
            this.scene.players.forEach(player => {
                this.scene.physics.add.overlap(this, player, () => console.log("Overlap!!!"));
                this.scene.physics.add.collider(this, player, () => console.log("Collision!!!"));
            });
        this.setImmovable();
    }
}