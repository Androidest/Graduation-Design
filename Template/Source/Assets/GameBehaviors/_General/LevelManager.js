class LevelManager
{
    constructor(objectManager)
    {
        this.boxSize = 2;
        this.maxSpawnDist = 20;
        this.objectManager = objectManager;
        this.objects = objectManager.objects;
        this.maxSeq = sequence.length;
    }

    restart()
    {
        this.objects = this.objectManager.objects;
        this.seqIndex = 0;
        this.nextSpawnPos = 0;
        while(this.nextSpawnPos < this.maxSpawnDist)
            this.spawnLevel();
    }

    spawnLevel()
    {
        let seq = sequence[this.seqIndex];
        this.nextSpawnPos += seq[0]; //delta z
        let types = levels[seq[1]][seq[2]][seq[3]];
        let i = Math.floor(Math.random()*types.length);
        let template = types[i];
        
        let clone;
        let hasRotation = template[0].length > 4;
        for(let obj of template)
        {
            clone = this.objectManager.spawn(obj[0]);
            if(!clone)
                continue;

            clone.position.x = obj[1];
            clone.position.y = obj[2];
            let z = obj[3] + this.nextSpawnPos;
            clone.position.z = z;
            this.nextSpawnPos = z;

            if(hasRotation)
            {
                clone.rotation.x = obj[4];
                clone.rotation.y = obj[5];
                clone.rotation.z = obj[6];
            }

            clone.boxMin = z - this.boxSize;
            clone.boxMax = z + this.boxSize;
            clone.scalingDeterminant = 1;
            clone.unfreezeWorldMatrix();
            if(clone.isDynamic)
                clone.triggerEvent("Spawn");
        }

        if(++this.seqIndex == this.maxSeq)
            this.seqIndex = 0;
    }

    update(playerPos)
    {
        if(this.nextSpawnPos < this.maxSpawnDist + playerPos.z)
            this.spawnLevel();
        
        if(this.objects[0].position.z < playerPos.z)
            this.objectManager.removeHead();
    }
}