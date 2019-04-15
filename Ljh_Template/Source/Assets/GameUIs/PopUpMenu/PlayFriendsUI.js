class PlayFriendsUI
{
    constructor(popUpMenu)
    {
        this.initPanelButton();
        this.initNoThanks();
        this.initErrorMessage();

        this.popUpMenu = popUpMenu;
        popUpMenu.panel.addChild(this.panelButton);
        popUpMenu.addChild(this.noThanks);
        popUpMenu.addChild(this.error);
    }

    //======================Events===============================
    onPlayFriends()
    {
        let message = "Save animal save humanity!";
        let successFunc = ()=>
        {
            this.popUpMenu.switchMenu(false);
            GameEvent.triggerEvent("Restart", true);
        };

        let sameContextFunc = ()=>
        {
            this.error.text = "This friend helped you already";
            this.error.isVisible = true;
        }

        FBInterface.playFriends(message, shareImage, successFunc, sameContextFunc);
    }

    show(flag)
    {
        if(flag)
            this.popUpMenu.title.text = "CONTINUE?";
        this.panelButton.isVisible = flag;
        this.noThanks.isVisible = flag;
        this.error.isVisible = false;
    }

    //======================init===================================
    initPanelButton()
    {
        let w  = 0.382;
        let h = 0.608;
        let x = (0.5 - w * 0.5); //center
        let y = 0.28;

        let button = new Button(x*100+"%", y*100+"%", w, h);
        button.background = null;
        button.addOnClick(this.onPlayFriends.bind(this));

        let img = new ImageRect(0,0,1,1);
        img.setImage("Assets/Images/UI/PlayFriends_button.png");
        button.addChild(img);
        
        this.panelButton = button;
    }

    initNoThanks()
    {
        let w  = 0.3;
        let h = 0.047;
        let x = (0.5 - w * 0.5); //center
        let y = 0.82;
      
        let button = new TextBlock(x*100+"%", y*100+"%", w, h);
        button.fontSize = h * Game.canvas.height * 0.5;
        button.text = "NO THANKS";
        button.fontStyle = "bold";
        button.textHorizontalAlignment = AlignHCenter;
        button.textVerticalAlignment = AlignVCenter;
        button.addOnClick(()=>
        {
            this.popUpMenu.switchMenu(false);
            GameEvent.triggerEvent("HomeMenu", true);
        });

        this.noThanks = button;
    }

    initErrorMessage()
    {
        let w  = 1;
        let h = 0.1;
        let x = (0.5 - w * 0.5); //center
        let y = 0.69;
      
        let error = new TextBlock(x*100+"%", y*100+"%", w, h);
        error.fontSize = h * Game.canvas.height * 0.25;
        error.color = "#FFE682";
        error.textHorizontalAlignment = AlignHCenter;
        this.error = error;

        this.error = error;
    }
}