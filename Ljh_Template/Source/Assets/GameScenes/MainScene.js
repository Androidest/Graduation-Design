class MainScene
{
    start()
    {
        this.optimize();

        
    }

    optimize()
    {
        let scene = Game.scene;
        scene.blockMaterialDirtyMechanism = true;
        scene.autoClearDepthAndStencil = true; // Depth and stencil, obviously
        scene.autoClear = true;
    }
}
