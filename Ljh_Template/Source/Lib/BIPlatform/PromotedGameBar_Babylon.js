//================= PromoatedGameBar ================================
class PromotedGameBar extends Rectangle
{
    constructor(x,y,w, imgName, gameName, numOfRequestedGames, devState) 
    {
        let width  = Game.canvas.width;
        let height = Game.canvas.height;

        let gap = 0.03*width;
        let bheight = ((width*w)-(numOfRequestedGames+1)*gap)/numOfRequestedGames;
        let h = (bheight + 2*gap) + "px";
        x = (width * x) + "px";
        y = (height * y) + "px";
        w = (width * w) + "px";

        super(x,y,w,h);
        this.isVisible = false;
        this.background = null;

        let bg = new ImageRect(0,0,1,1);
        bg.setImage("Assets/Images/UI/" + imgName);
        this.addChild(bg);

        this.buttons = new Array(numOfRequestedGames);
        this.promotedGameIcons = new Array(numOfRequestedGames);
        for(let i=0; i<numOfRequestedGames; ++i)
        {
            let b = new Button( gap+(gap+bheight)*i+"px", gap+"px", bheight+"px", bheight+"px");
            b.background = this.background;
            b.gameID = 0;
            b.addOnClick(() => { FBInstant.switchGameAsync(b.gameID); });
            this.addChild(b);

            this.promotedGameIcons[i] = new ImageRect(0,0,1,1);
            b.addChild(this.promotedGameIcons[i]);

            this.buttons[i] = b;
        }

        BIPlatform.init(gameName, numOfRequestedGames, devState);
        this.fetch();

        GameEvent.addEvent("FetchPromotedGames", this.fetch.bind(this));
    }

    fetch()
    {
		BIPlatform.fetchPromotedGamesAsync()
		.then((requestedGames)=>
		{
			if (requestedGames.length == BIPlatform.numOfRequestedGames)
                this.updateDisplay(requestedGames);
			else
                throw("Expected to promote " + BIPlatform.numOfRequestedGames + "games, but only " + requestedGames.length + "games supplied!");
		})
		.catch(function(error) 
		{
			console.error("some error happened when fetching promoted games.");
			console.error(error);
		});
    }

    updateDisplay(promotedGames) 
    {
        for(let i=0; i<promotedGames.length; ++i)
        {
            this.promotedGameIcons[i].setImage("data:image/png;base64,"+promotedGames[i].imgData);
            this.buttons[i].gameID = promotedGames[i].gameID;
        }
        this.isVisible = true;
    }
}