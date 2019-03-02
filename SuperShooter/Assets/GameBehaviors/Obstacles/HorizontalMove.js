class HorizontalMove extends BehaviorScript
{
    start(speed)
    {
        this.velocity = speed;
    }

    clone(behavior)
    {
        this.velocity = (Math.random()>0.5)? behavior.velocity : -behavior.velocity;
    }

    update()
    {
        this.position.x += GameTime.deltaMiliseconds * this.velocity;
        if(this.position.x > 0.7)
        {
            this.position.x = 0.7;
            this.velocity = -this.velocity;
        }
        else if(this.position.x < -0.7)
        {
            this.position.x = -0.7;
            this.velocity = -this.velocity;
        }
    }
}