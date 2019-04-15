class Explosion extends BABYLON.ParticleSystem
{ 
    constructor()
    {
        super("Explosion", 40, Game.scene);
        this.init();
    }

    clone() 
    {
        return new Explosion();
    }

    init()
    {
        let v = 60;
        this.particleTexture = new BABYLON.Texture("Assets/Textures/Flare.png", Game.scene);
        this.minAngularSpeed = 0;
        this.maxAngularSpeed = 0;
        this.minSize = 0.06;
        this.maxSize = 0.16;
        this.minLifeTime = 1;
        this.maxLifeTime = 1;
        this.minEmitPower = 0.01;
        this.maxEmitPower = 0.3;
        this.emitRate = 3000;
        this.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        this.gravity = new BABYLON.Vector3(0, -v, 0);
        this.createPointEmitter(new BABYLON.Vector3(-v, v, 0), new BABYLON.Vector3(v, v, 0));
    }

    play(obj)
    {
        this.emitter = obj.position;
        this.start();
        setTimeout(()=>this.stop(), this.maxLifeTime*1000);
    }
}