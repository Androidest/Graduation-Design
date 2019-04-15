class MainScene
{
    start()
    {
        this.optimize();
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
