class GunMovement extends BehaviorScript
{
    start(objectManager, shootingHead, gunBody)
    {   
        this.shootingHead = shootingHead;
        this.gunBody = gunBody;
        this.objectManager = objectManager;

        this.isShooting = false;
        this.endTime = 0;
        this.shootInterval = 100;
        this.shootSpeed = 13;

        this.maxUp = Math.PI*0.2;
        this.maxDown = Math.PI*0.1;
        this.maxLeft = Math.PI*0.2;
        this.maxRight = Math.PI*0.15;
        
        GameEvent.addEvent("Restart", this.onRestart.bind(this));
        GameEvent.addEvent("GameOver", this.onGameOver.bind(this));
        GameEvent.addEvent("Touch", this.onTouch.bind(this));
        GameEvent.addEvent("Drag", this.onDrag.bind(this));
        GameEvent.addEvent("Release", this.onRelease.bind(this));

        this.addEnergy = GameEvent.getEvent("AddEnergy");
        this.shoot = GameEvent.getEvent("Shoot");
    }

    
    onRestart() 
    {  
        this.isShooting = false;
        this.isEnabled = true;
    }

    onGameOver()
    {
        this.isEnabled = false;
    }

    onTouch()
    {
        this.lastRotationx = this.rotation.x;
        this.lastRotationy = this.rotation.y;
        this.endTime = 0;
        this.isShooting = true;
    }

    onDrag(xPercent, yPercent)
    {
        this.rotation.x = this.lastRotationx + yPercent * Math.PI*1.5;
        this.rotation.y = this.lastRotationy + xPercent * Math.PI*1.5;

        if(this.rotation.x < -this.maxUp) this.rotation.x = -this.maxUp;
        if(this.rotation.x >  this.maxDown) this.rotation.x = this.maxDown;
        if(this.rotation.y < -this.maxLeft) this.rotation.y = -this.maxLeft;
        if(this.rotation.y >  this.maxRight) this.rotation.y = this.maxRight;
    }

    onRelease()
    {
        this.isShooting = false;
    }

    update()
    {
        if(GameTime.time > this.endTime)
        {
            this.endTime = GameTime.time + this.shootInterval;
            let bullet = this.objectManager.loopBullet();
            if(this.isShooting)
            {
                this.shoot.triggerEvent();
                this.addEnergy.triggerEvent(-1);
                bullet.position.copyFrom(this.shootingHead.absolutePosition);
                bullet.rotation.copyFrom(this.rotation);
                bullet.velocity = this.forward.scale(this.shootSpeed);
                bullet.setEnabled(true);
                bullet.curTarget = 0;
                this.gunBody.position.z = -0.04;
            }
            else bullet.setEnabled(false);
        }
        if(this.gunBody.position.z < 0)
            this.gunBody.position.z += GameTime.deltaSeconds * 0.2;
        else this.gunBody.position.z = 0;
    }
}