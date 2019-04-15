class PopUpMenu extends SimpleMenu
{
    constructor()
    {
        super("PopUpMenu");
        this.scaleTime = 100;
        this.bg.alpha = 0.3;
        
        this.initPanel();
        //this.intro = new IntroUI(this);
        this.playFriends = new PlayFriendsUI(this);

        //this.intro.show(true);
        this.playFriends.show(false);
        this.curMenu = this.playFriends;

        GameEvent.addEvent("PopUpMenu", this.onPopUp.bind(this));
        GameEvent.addEvent("SwitchPopUpMenu", this.onSwitch.bind(this));
    }

    //======================Events===============================
    onSwitch(id)
    {
        this.curMenu.show(false);
        switch(id)
        {
            case 0: this.curMenu = this.playFriends; break;
            //case 1: this.curMenu = this.intro; break;
        }
        this.curMenu.show(true);
    }

    onPopUp()
    {
        this.targetTime = GameTime.time + this.scaleTime;
        this.panel.scaleX = 0.5;
        this.panel.scaleY = 0.5;
        GameUI.addAction(()=>
        {
            if(GameTime.time > this.targetTime)
            {
                this.panel.scaleX = 1;
                this.panel.scaleY = 1;
                return 1;
            }
            
            let scale = 1 - 0.5*(this.targetTime - GameTime.time)/this.scaleTime; 
            this.panel.scaleX = scale;
            this.panel.scaleY = scale;
        });
    }

    //============================init=================================
    initPanel()
    {
        let width  = 0.8;
        let w = width * Game.canvas.width;
        let h = 0.875 * width * Game.canvas.width;
        let x = (0.5 - width * 0.5) * Game.canvas.width; //center
        let y = 0.31 * Game.canvas.height;

        this.panel = new Rectangle(x+"px", y+"px", w+"px", h+"px");
        this.panel.background = null;
        this.panel.transformCenterX = 0.5;
        this.panel.transformCentery = 0.5;
        this.addChild(this.panel);

        let img = new ImageRect(0,0,1,1);
        img.setImage("Assets/Images/UI/PopUpPanel.png");
        this.panel.addChild(img);

        let title = new TextBlock(0, 0, 1, 0.25);
        title.fontSize = h * 0.08;
        title.fontStyle = "bold";
        this.panel.addChild(title);

        this.title = title;
    }
}