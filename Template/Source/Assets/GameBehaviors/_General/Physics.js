class Physics
{
    constructor(objectManager)
    {
        //tuning
        this.energyDecrease = -20;

        //original
        this.nextScoreZ = 0;
        this.objectManager = objectManager;
        this.objects = objectManager.objects;
        this.effects = objectManager.effects;
        this.bullets = objectManager.bullets.cache;

        this.addEnergy = GameEvent.getEvent("AddEnergy");
        this.addScore = GameEvent.getEvent("AddScore");
        this.hitObstacle = GameEvent.getEvent("HitObstacle");
        this.hitPlayer = GameEvent.getEvent("HitPlayer");

        this.prompt = GameEvent.getEvent("Prompt"); 
    }

    restart()
    {
        this.isGameOver = false;
        this.nextScoreZ = 0;
        this.objects = this.objectManager.objects;
        this.effects = this.objectManager.effects;
    }

    checkType(obj)
    {
        this.objectManager.moveToEffect(obj);
        if(obj.type!=0)
            this.hitObstacle.triggerEvent(); 

        if(this.isGameOver) 
            return;

        switch(obj.type)
        {
            case 0: this.addEnergy.triggerEvent(20); 
                    this.prompt.triggerEvent("+20"); 
                    break;
            case 1: break;
        }
    }

    playerCollision(playerPos)
    {
        let obj = this.objects[0];
        if(obj.position.z < playerPos.z+1)
        {
            let left = new Vector3(playerPos.x-0.1, playerPos.y, playerPos.z);
            let right = new Vector3(playerPos.x+0.1, playerPos.y, playerPos.z);
            if(obj.intersectsPoint(left) || obj.intersectsPoint(right))
            {
                if(obj.type != 0)
                {
                    this.hitPlayer.triggerEvent();
                    this.addEnergy.triggerEvent(this.energyDecrease); 
                    this.prompt.triggerEvent("-20");
                    this.objectManager.removeHead();
                }
            }
        }   

        if(playerPos.z > this.nextScoreZ)
        {
            this.nextScoreZ = playerPos.z + 2;
            this.addScore.triggerEvent();
        }
    }

    bulletCollision()
    {
        for(let bullet of this.bullets)
        {
            if(bullet.isEnabled()) 
            {
                //=============bullet movement============
                bullet.velocity.scaleAndAddToRef(GameTime.deltaSeconds, bullet.position);
                //=============set beacon (collision with floor)==========
                let x = bullet.position.x;
                let y = bullet.position.y;

                if(y < 0)
                {
                    if(-1<x && x<1)
                    {
                        bullet.setEnabled(false);
                        let beacon = this.objectManager.loopBeacon();
                        beacon.unfreezeWorldMatrix();
                        beacon.position.x = bullet.position.x;
                        beacon.position.z = bullet.position.z;
                        beacon.freezeWorldMatrix();
                    }
                    continue;
                }
                else if(y<7 && -2<x && x<2)
                {
                    let z = bullet.position.z;
                    for(let i=bullet.curTarget; i<this.objects.length; ++i)
                    {
                        let obj = this.objects[i];
                        if(obj.boxMin > z) break;
                        if(obj.boxMax < z)
                        {
                            bullet.curTarget=i+1;
                            continue;
                        }
                        if(obj.intersectsPoint(bullet.position))
                        {
                            this.checkType(obj);
                            bullet.setEnabled(false);
                        }
                    }
                }
            }
        }
    }

    effectsPhysics()
    {
        let deltaSeconds = GameTime.deltaSeconds*6;
        for(let i=this.effects.length-1; i>=0; --i)
        {
            let obj = this.effects[i];
            obj.scalingDeterminant -= deltaSeconds;
            obj.unfreezeWorldMatrix();
            if(obj.scalingDeterminant < 0)
            {
                let exp = this.objectManager.loopExplosion();
                exp.play(obj);
                this.objectManager.removeEffect(obj);
            }
        }
    }

    update(playerPos)
    {
        this.playerCollision(playerPos);
        this.bulletCollision();
        this.effectsPhysics();
        this.objectManager.loopBridge(playerPos.z);
    }
}