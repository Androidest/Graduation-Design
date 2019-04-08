class PlayerMovement extends BehaviorScript
{
    start(objectManager, levelManager, physics)
    {   
        this.speed = 3;

        this.maxShakeTime = 400;
        this.endShakeTime = 0;

        this.isGameOver = false;
        this.isEnabled = false;
        this.objectManager = objectManager;
        this.levelManager = levelManager;
        this.physics = physics;
        
        GameEvent.addEvent("HitPlayer", this.onHitEffect.bind(this));
        GameEvent.addEvent("Restart", this.onRestart.bind(this));
        GameEvent.addEvent("GameOver", this.onGameOver.bind(this));
    }

    onRestart()
    {
        this.isEnabled = true;
        this.position.z = 0;
        this.isGameOver = false;
        this.objectManager.restart();
        this.levelManager.restart();
        this.physics.restart();
    }

    onGameOver()
    {
        this.isGameOver = true;
        this.physics.isGameOver = true;
    }

    onHitEffect()
    {
        this.endShakeTime = GameTime.time + this.maxShakeTime;
    }
    
    update()
    {
        //GameEvent.triggerEvent("out", Game.fps);
        let time = GameTime.time;
        
        if(!this.isGameOver)
        {
            this.position.x = 0.7*Math.sin(time/3000);
            this.position.z += GameTime.deltaSeconds * this.speed;
        }
        
        if(this.endShakeTime)
        {
            if(this.endShakeTime > time)
                this.rotation.z = 0.04*Math.sin(time/27);
            else
            {
                this.endShakeTime = 0;
                this.rotation.z = 0;
            }
        }

        this.physics.update(this.position);
        this.levelManager.update(this.position);
    }
}