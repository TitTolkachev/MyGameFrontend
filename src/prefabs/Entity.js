class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, id, x, y, width, depth, key) {
        super(scene, x, y, key);

        this.id = id;
        this.setDepth(depth);
        this.displayWidth = width;
        this.scaleY = this.scaleX;
        this.setOrigin(0.5);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        // this.ctx.physics.add.collider(this, this.depth, () => console.log("Collision!!!"));
        // this.spr.setOnCollide(()=>console.log("Collision!!!"));

        this.frames = {
        };

        this.states = {
            idle: true,
            walk: false,
            hurt: false,
            dead: false,
            last: false
        };

        this.targetX = false;
        this.targetY = false;
        this.direction = {
            last: false,
            current: 'down'
        }

        this.health = {
            current: 1,
            total: 1
        }

        this.speed = {
            base: 1,
            current: 1,
            max: 1
        }
    }

    // destroy(parent) {
    //     this.destroySprite()
    //     parent.splice(parent.indexOf(this), 1);
    // }

    updateSpriteDirection() {
        switch (this.direction.current) {
            case 'up':
                break;
            case 'down':
                break;
            case 'left':
                p.flipX = true;
                break;
            // right
            default:
                p.flipX = false;
                break;
        }
    }

    // Animations
    startNewAnim(key) {
        this.stopAnim();

        switch (key) {
            case 'idle':
                this.startIdleAnim();
                break;
            case 'walk':
                this.startWalkAnim();
                break;
            case 'hurt':
                this.startHurtAnim();
                break;
            case 'dead':
                this.startDeadAnim();
                break;
            default:
        }
    }
    stopAnim() {
        this.spr.anims.stop();
        this.spr.setFrame(this.frames.idle);
    }
    startIdleAnim() {
        this.spr.setFrame(this.frames.idle);
    }
    startWalkAnim() {
        this.spr.play(this.key + '-walk');
    }
    startHurtAnim() {
        this.spr.setFrame(this.frames.hurt);
    }
    startDeadAnim() {
        this.spr.setFrame(this.frames.dead);
    }

    // Setters

    // Moving
    checkVelocity() {
        if (this.targetX || this.targetY) {
            if (this.body.velocity.x > 0 && this.x > this.targetX ||
                this.body.velocity.x < 0 && this.x < this.targetX ||
                this.body.velocity.y < 0 && this.y < this.targetY ||
                this.body.velocity.y > 0 && this.y > this.targetY) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                this.setPosition(this.targetX, this.targetY);
                this.targetX = false;
                this.targetY = false;
            }
        }
    }
}