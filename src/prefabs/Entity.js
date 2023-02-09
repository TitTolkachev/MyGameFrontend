class Entity {
    constructor(ctx, id, width, key) {
        this.ctx = ctx;

        this.id = id;
        this.width = width;
        // this.height = 32;
        this.depth = 1;

        this.key = key;
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
            corrent: 1,
            total: 1
        }

        this.speed = {
            base: 1,
            current: 1,
            max: 1
        }
    }

    destroy(parent) {
        this.destroySprite()
        parent.splice(parent.indexOf(this), 1);
    }

    destroySprite() {
        if (this.spr) {
            this.spr.destroy();
        }
        this.spr = false;
    }

    createSprite(x, y) {
        if (this.spr)
            this.spr.destroy();

        this.spr = this.ctx.add.sprite(x, y, this.key);
        this.spr.displayWidth = this.width;
        this.spr.scaleY = this.spr.scaleX;
        this.spr.setOrigin(0.5);
        this.ctx.physics.add.existing(this.spr);
    }

    updateSpriteDirection() {
        switch (this.direction.current) {
            case 'up':
                break;
            case 'down':
                break;
            case 'left':
                p.image.flipX = true;
                break;
            // right
            default:
                p.image.flipX = false;
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
    setSpritePos(x, y) {
        this.spr.x = x;
        this.spr.y = y;
    }
    setDepth(depth) {
        this.depth = depth;
        this.spr.setDepth(depth);
    }

    // Moving
    checkVelocity() {
        if (this.spr && (this.targetX || this.targetY)) {
            if (this.spr.body.velocity.x > 0 && this.spr.x > this.targetX ||
                this.spr.body.velocity.x < 0 && this.spr.x < this.targetX ||
                this.spr.body.velocity.y < 0 && this.spr.y < this.targetY ||
                this.spr.body.velocity.y > 0 && this.spr.y > this.targetY) {
                this.spr.body.velocity.x = 0;
                this.spr.body.velocity.y = 0;
                this.setSpritePos(this.targetX, this.targetY);
                this.targetX = false;
                this.targetY = false;
            }
        }
    }
}