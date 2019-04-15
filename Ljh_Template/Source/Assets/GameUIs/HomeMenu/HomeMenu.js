class HomeMenu extends SimpleMenu
{
    constructor()
    {
        super("HomeMenu");

        this.isIntro = true; //TODO

        this.initBar(0.83);
        this.initTitle(0.04);
        this.initLastScore(0.14);
        this.initLeaderboard(0.23);
        this.initButtons(0.73);

        this.leaderboards = Array(2);

        GameEvent.addEvent("UpdateScore", this.onScoreUpdate.bind(this));
        GameEvent.addEvent("UpdatePlayerInfo", this.onPlayerInfoUpdate.bind(this));
        GameEvent.addEvent("LoadLeaderboard", this.onleaderboardLoaded.bind(this));
    }

    onSwitchLeaderboard(id)
    {
        let isLeft = id==0;
        this.lbButtons[0].isVisible = !isLeft;
        this.lbButtons[1].isVisible = isLeft;
        
        let leaderboard = this.leaderboards[id];
        for(let i=0; i<leaderboard.length; ++i)
        {
            let player = leaderboard[i].getPlayer();
            this.playerImg[i].setImage(player.getPhoto());
            this.playerName[i].text = player.getName();
            this.playerScore[i].text = leaderboard[i].getScore().toString() + " m";
        }

        if(leaderboard.length < 5) 
        {
            for(let i=leaderboard.length; i<5; ++i)
            {
                this.playerImg[i].setImage(null);
                this.playerName[i].text = "--";
                this.playerScore[i].text = "--";
            }
        }
    }

    onleaderboardLoaded(leaderboard, id)
    {
        this.leaderboards[id] = leaderboard;
        if(id==0)
            this.onSwitchLeaderboard(0);
        
    }

    onPlayerInfoUpdate(img, name)
    {
        this.myImg.setImage(img);
        this.myName.text = name;
    }

    onScoreUpdate(score, bestScore, rank)
    {
        this.score.text = score.toString() + "m";
        this.best.text = bestScore.toString() + " m";
        this.rank.text = rank.toString();
    }

    initTitle(y)
    {
        let titlex = Game.canvas.width*0.1;
        let titley = Game.canvas.height*y;
        let titlew = Game.canvas.width*0.8;
        let titleh = titlew/284.0*48;
        let title = new ImageRect(titlex + "px", titley + "px", titlew + "px", titleh + "px");
        title.setImage("Assets/Images/UI/title.png");
        this.addChild(title);
    }

    initLastScore(y)
    {
        let fontSize = Game.canvas.height*0.08;
        let score = new TextBlock(0, y*Game.canvas.height+"px", 1, fontSize+"px");
        score.fontStyle = "bold";
        score.fontSize = fontSize;
        score.color = "#FFE680";
        score.textHorizontalAlignment = AlignHCenter;
        score.fontFamily = "MainFont";
        this.addChild(score);
        this.score = score;
    }

    initLeaderboard(y)
    {
        y = y * Game.canvas.height;
        let panelY = y+Game.canvas.height*0.11;

        let h = Game.canvas.height * 0.34;
        let w = h*1.2;
        let x = (Game.canvas.width - w)/2;
        
        let barH = h/5;
        let imgW = barH * 0.8;
        let imgX = barH * 1.2;
        let imgY = (barH - imgW)/2;

        let scoreW = w * 0.2;
        let scoreX = w-scoreW; 
        
        let nameX = barH*2.2;
        let nameW = scoreX - nameX;
        let fontSize = barH * 0.3;

        //=========init player info bar==================
        this.rank = new TextBlock(x+"px", y+"px", imgX+"px", barH+"px");
        this.rank.textHorizontalAlignment = AlignHCenter;
        this.rank.fontSize = fontSize;
        this.rank.fontStyle = "bold";
        this.rank.color = "#FFE680";
        this.rank.text = "--";
        this.addChild(this.rank);

        this.myImg = new ImageRect(x+imgX+"px", y+"px", imgW+"px", imgW+"px");
        this.addChild(this.myImg);

        this.myName = new TextBlock(x+nameX+"px", y+"px", nameW+"px", barH+"px");
        this.myName.textHorizontalAlignment = AlignLeft;
        this.myName.fontSize = fontSize;
        this.myName.color = "#FFE680";
        this.myName.fontStyle = "bold";
        this.myName.text = "--";
        this.addChild(this.myName);

        this.best = new TextBlock(x+scoreX+"px", y+"px", scoreW+"px", barH+"px");
        this.best.textHorizontalAlignment = AlignHCenter;
        this.best.fontSize = fontSize;
        this.best.color = "#FFE680";
        this.best.fontStyle = "bold";
        this.addChild(this.best);

        //========init leaderboard panel image===========
        let delta = h*0.1166;
        let bgHeight = h*1.18;
        let bg = new ImageRect(x + "px", panelY-delta + "px", w + "px", bgHeight + "px");
        bg.setImage("Assets/Images/UI/leaderboard.png");
        this.addChild(bg);

        //========init leaderboard switch buttons===============
        let bh = h*0.1166;
        let by = panelY-bh;
        let cw = w*0.486;
        let cdelta = w-cw;
        this.lbButtons = new Array(2);
        for( let i=0; i<2; ++i)
        {
            let cover = new ImageRect((x+i*cdelta)+"px", by+"px", cw+"px", bh+"px")
            cover.setImage("Assets/Images/UI/button_cover.png");
            cover.addOnClick(()=>this.onSwitchLeaderboard(i));
            this.lbButtons[i] = cover;
            this.addChild(cover);
        }
        this.lbButtons[0].isVisible = false;

        //=========init leaderboard info==================
        this.playerImg = new Array(5);
        this.playerName = new Array(5);
        this.playerScore = new Array(5);
        for(let i=0; i<5; ++i)
        {
            let img = new ImageRect(x+imgX+"px", panelY+imgY+i*barH+"px", imgW+"px", imgW+"px");
            this.playerImg[i] = img;
            this.addChild(img);

            let name = new TextBlock(x+nameX+"px", panelY+i*barH+"px", nameW+"px", barH+"px");
            name.text = "--";
            name.textHorizontalAlignment = AlignLeft;
            name.fontSize = fontSize;
            this.playerName[i] = name;
            this.addChild(name);

            let score = new TextBlock(x+scoreX+"px", panelY+i*barH+"px", scoreW+"px", barH+"px");
            score.text = "--";
            score.textHorizontalAlignment = AlignHCenter;
            score.fontSize = fontSize;
            this.playerScore[i] = score;
            this.addChild(score);
        }
    }

    initButtons(y)
    {
        y = Game.canvas.height*y;
        let numb = 3;
        let width  = Game.canvas.width*0.14;
        let startX = (Game.canvas.width - width*numb)/(numb+1);
        let delta = startX + width;
        let imgName = ["share_icon.png", "play_icon.png", "music_on_icon.png"];
        let b = new Array(3);

        for(let i=0; i<numb; ++i)
        {
            let button = new Button((startX+delta*i)+"px", y, width+"px", width+"px");
            button.background = null;
            this.addChild(button);

            let img = new ImageRect(0, 0, 1, 1); 
            img.setImage("Assets/Images/UI/" + imgName[i]);
            button.addChild(img);

            b[i] = button;
        }

        b[0].addOnClick(()=>GameEvent.triggerEvent("Share"));
        b[1].addOnClick(()=>
        { 
            this.switchMenu(false);
            if(this.isIntro)
            {
                this.isIntro = false;
                GameEvent.triggerEvent("Tutorial", true);
            } 
            GameEvent.triggerEvent("Restart", false);
        });
        b[2].addOnClick(()=>GameEvent.triggerEvent("SwitchMusic"));
        b[2].addChild(new SoundOff("music_off_icon", "SwitchMusic", false));
    }

    initBar(y)
    {
        let barx = 0.08;
        let bary = y;
        let barWidth = 1-2*barx;
        let imgName = "promotion_box.png";
        let numOfRequestedGames = 4;

        let promotedGameBar = new PromotedGameBar(barx, bary, barWidth, imgName, Game.gameName, numOfRequestedGames, Game.devState);
        this.addChild(promotedGameBar);
    }
}