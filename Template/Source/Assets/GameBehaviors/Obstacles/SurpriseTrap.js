class SurpriseTrap extends BehaviorScript
{
    start()
    {
        this.addEvent("Spawn", this.spawn.bind(this));
    }

    clone(behavior)
    {
        this.start();        
    }

    spawn()
    {
        this.rotation.x = 0;
        this.activatePos = this.position.z-3;
    }

    update()
    {   
        if(Game.playerView.position.z > this.activatePos)
        {
            this.rotation.x -= GameTime.deltaMiliseconds * 0.018;
            if(this.rotation.x < -1.5707)
                this.rotation.x = -1.5707;
        }
    }
}