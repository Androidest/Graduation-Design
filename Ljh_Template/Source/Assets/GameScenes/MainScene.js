class TreeMovement extends BehaviorScript
{
    start()
    {
 
    }

    update()
    {
        this.position.y = Math.sin(GameTime.time/100);
    } 
}

class CarMovement extends BehaviorScript
{
    start()
    {
 
    }

    update()
    {
        this.position.x = Math.sin(GameTime.time/200);
    } 
}

class MainScene
{
    start() 
    {
        this.optimize();

        let tree = GameObject.findByName("Tree"); 
        tree.isVisible = true;
        tree.position.y += 0;
        tree.addBehavior(TreeMovement);

        let car = GameObject.findByName("Car");
        car.addBehavior(CarMovement);
        car.addBehavior(TreeMovement);
        /*let world = GameObject.findByName("ARWorld");
        let camera = GameObject.findByName("Camera");
        world.addBehavior(ARWorld, camera);

        let cube = GameObject.findByName("Tree");
        cube.convertToFlatShadedMesh();*/
    }

    optimize()
    {
        let scene = Game.scene;
        scene.blockMaterialDirtyMechanism = true;
        scene.autoClearDepthAndStencil = true; // Depth and stencil, obviously
        scene.autoClear = true;
    }
}
