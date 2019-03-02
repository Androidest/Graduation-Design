class ObjectManager
{
    constructor(bridge, bullet, beacon)
    {
        //========init objects=============
        this.objects = new Array();
        this.effects = new Array();
        this.caches = new Array();
        
        for(let obj of Game.scene.meshes)
        {
            let name = obj.name.split("_");
            if(name[0] == "Obj")
            {
                obj.type = parseInt(name[1], 10);
                this.caches[obj.type] = new ObjCache(obj, 30);
            }
        }

        //=======init Bridge================
        const bridgeNumb = 4;
        this.bridgeLength = 6;
        this.bridgeWholeLength = this.bridgeLength * bridgeNumb;
        this.loopCondition = this.bridgeLength;
        this.bridges = new CircularQueue(bridge, bridgeNumb, (obj, i)=> {obj.unfreezeWorldMatrix(); obj.position.z = this.bridgeLength*i; obj.freezeWorldMatrix();} );

        //========init bullet============
        const bulletNumb = 10;
        this.bullets = new CircularQueue(bullet, bulletNumb, (obj, i)=> obj.setEnabled(false));
        this.beacons = new CircularQueue(beacon, bulletNumb, ()=>{});

        //========init bullet============
        const explosionNumb = 10;
        this.explosions = new CircularQueue(new Explosion(), explosionNumb, (obj, i)=> obj.stop(), (obj)=>obj.clone() );
    }

    restart()
    {
        this.loopCondition = this.bridgeLength;
        this.clear();
        this.bridges.clear();
        this.bullets.clear();
        this.beacons.clear();
        this.explosions.clear();
    }

    loopBullet() { return this.bullets.loopPop(); }
    loopBeacon() { return this.beacons.loopPop(); }
    loopExplosion() { return this.explosions.loopPop(); }

    loopBridge(pos)
    {
        if(pos < this.loopCondition)
            return;
        this.loopCondition += this.bridgeLength;
        
        let bridge = this.bridges.loopPop();
        bridge.unfreezeWorldMatrix();
        bridge.position.z += this.bridgeWholeLength;
        bridge.freezeWorldMatrix();
    }

    clear()
    {
        for(let obj of this.objects)
            this.caches[obj.type].push(obj);

        for(let obj of this.effects)
            this.caches[obj.type].push(obj);

        this.objects = [];
        this.effects = [];
    }
    
    spawn(type)
    {
        let obj = this.caches[type].pop();
        if(!obj)
        {
            console.error("Not enough object in cache to spawn!");
            return null;
        }

        this.objects.push(obj); //obj.showBoundingBox = true;
        return obj;
    }

    remove(obj)
    {
        let l = this.objects.length;
        for(let i=0; i<l; ++i)
        {
            if(this.objects[i] == obj)
            {
                this.objects.splice(i, 1);
                this.caches[obj.type].push(obj);
                return;
            }  
        }
    }

    moveToEffect(obj)
    {
        let l = this.objects.length;
        for(let i=0; i<l; ++i)
        {
            if(this.objects[i] == obj)
            {
                this.objects.splice(i, 1);
                this.effects.push(obj);
                return;
            }  
        }
    }

    removeEffect(obj)
    {
        let l = this.effects.length-1;
        for(let i=0; i<=l; ++i)
        {
            if(this.effects[i] == obj)
            {
                this.effects[i] = this.effects[l];
                this.effects.length = l;
                this.caches[obj.type].push(obj);
                return;
            }  
        }
    }

    removeHead() 
    { 
        let obj = this.objects[0];
        this.caches[obj.type].push(obj);
        this.objects.splice(0, 1); 
    }
}