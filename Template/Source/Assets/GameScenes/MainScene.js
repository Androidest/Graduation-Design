class MainScene
{
    start()
    {
        this.optimize();
        let player = GameObject.findByName("Player");
        Game.playerView = player;

        //=======init background=========
        let ratio = Game.canvas.width/Game.canvas.height;
        let background = new BABYLON.Layer("back", "Assets/Textures/background.png", Game.scene, true);
        background.texture.uScale = ratio;
        background.texture.uOffset = 0.5-ratio*0.5;

        //========init Bullet============
        let bullet = GameObject.findByName("Bullet");
        let beacon = GameObject.findByName("Beacon");

        //=======init bridge=========
        let road = GameObject.findByName("Road");
        road.material.opacityTexture = road.material.diffuseTexture;
        let bridge = GameObject.findByName("Bridge");

        //=========Obj_2 obstacle===========
        let obj2 = GameObject.findByName("Obj_2");
        obj2.addBehavior(ClockRotation);

        //=========Obj_3 obstacle===========
        let obj3 = GameObject.findByName("Obj_3");
        obj3.addBehavior(HorizontalMove, 0.001);

        //=========Obj_3 obstacle===========
        let obj4 = GameObject.findByName("Obj_4");
        obj4.addBehavior(SurpriseTrap);

        //========init Common Behavior============
        let score = new Score();
        let audioEffect = new AudioEffect();
        let glowEffect = new BABYLON.GlowLayer("GlowEffect", Game.scene, { mainTextureSamples: 2 });
        let input = new Input();
        let objectManager = new ObjectManager(bridge, bullet, beacon);
        let physics = new Physics(objectManager);
        let levelManager = new LevelManager(objectManager);

        //========init player============
        player.addBehavior(PlayerMovement, objectManager, levelManager, physics);

        //========init Gun============
        let gun = GameObject.findByName("Gun");
        let shootingHead = GameObject.findByName("ShootingHead");
        let gunBody = GameObject.findByName("GunBody");
        gun.addBehavior(GunMovement, objectManager, shootingHead, gunBody);
        
        GameEvent.triggerEvent("HomeMenu", true);
    }

    optimize()
    {
        let scene = Game.scene;
        scene.blockMaterialDirtyMechanism = true;
        scene.autoClearDepthAndStencil = true; // Depth and stencil, obviously
        scene.autoClear = true;
    }
}
