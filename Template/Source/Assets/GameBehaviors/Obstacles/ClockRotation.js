class ClockRotation extends BehaviorScript
{
    clone(behavior)
    {

    }
    update()
    {
        this.rotation.z += GameTime.deltaSeconds;        
    }
}