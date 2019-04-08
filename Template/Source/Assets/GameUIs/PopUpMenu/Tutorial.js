class Tutorial extends Rectangle
{
    constructor()
    {
        super(0,0,1,1);
        this.background = null;
        this.isVisible = false;

        let width = Game.canvas.width * 0.5;
        let img = new ImageRect(0, "25%", width+"px", width*1.26+"px");
        img.setImage("Assets/Textures/UI/tutorial.png");
        img.verticalAlignment = AlignVCenter;
        img.horizontalAlignment = AlignHCenter;
        this.addChild(img);

        GameEvent.addEvent("Tutorial", ()=>this.isVisible = true );

        this.addOnTouch(()=>
        {
            this.isVisible = false;
            this.isEnabled = false;
        });
    }
}