class HUDPanel extends Rectangle
{
    constructor()
    {
        let height = Game.canvas.height;
        
        super(0, 0, 1, (height*0.4)+"px");
        this.background = null;

        this.energyColor = "#FFA6F8";
        let energySize = height*0.09;
        this.energy = new TextBlock(0, "49%", 1, energySize+"px");
        this.energy.horizontalAlignment = AlignHCenter;
        this.energy.fontSize = energySize;
        this.energy.fontStyle = "bold";
        this.energy.fontFamily = "MainFont";
        this.energy.alpha = 1;
        this.energy.color = this.energyColor;
        this.energy.shadowBlur = energySize*0.3;
        this.energy.shadowColor = this.energy.color;
        this.addChild(this.energy);

        let imSize = height*0.08 +"px";
        let img = new ImageRect(0, "30%", imSize, imSize);
        img.horizontalAlignment = AlignHCenter;
        img.setImage("Assets/Textures/UI/energy.png");
        //img.addOnClick(()=>GameEvent.triggerEvent("Restart", false));
        this.addChild(img);

        let h = height * 0.04;
        let w = h * 4.5;

        this.score = new ScoreHUD("-5%", "8%", w, h, "Assets/Textures/UI/score.png");
        this.score.horizontalAlignment = AlignRight;
        this.score.setText("--");
        this.addChild(this.score);

        /*this.best = new ScoreHUD("65%", "8%", w, h, "Assets/Textures/UI/best.png");
        this.best.setText("--");
        this.best.setColor("#FFE682");
        this.addChild(this.best);*/

        this.onRestart();

        this.isContinue = false;
        this.time = -1;
        let bonusSize = height*0.07;
        this.bonusStart = height*0.35;
        this.moveDist = height*0.1;
        this.fadeOutTime = 1.7;
        this.prompt = new TextBlock(0,this.bonusStart+"px",1,bonusSize+"px");
        this.prompt.horizontalAlignment = AlignHCenter;
        this.prompt.fontSize = bonusSize;
        this.prompt.fontStyle = "bold";
        //this.prompt.fontFamily = "MainFont";
        this.prompt.alpha = 0;
        this.prompt.color = this.energyColor;
        GameUI.addChild(this.prompt);

        this.hitEffect = new ImageRect(0,0,1,1);
        this.hitEffect.setImage("Assets/Textures/UI/hitEffect.png");
        this.hitEffect.isVisible = false;
        GameUI.addChild(this.hitEffect);
    
        //GameEvent.addEvent("UpdateScore", this.onScoreUpdate.bind(this));
        GameEvent.addEvent("Scored", this.onScored.bind(this));
        GameEvent.addEvent("SetEnergy", this.onSetEnergy.bind(this));
        GameEvent.addEvent("Prompt", this.onPrompt.bind(this));
        GameEvent.addEvent("HomeMenu", this.onHide.bind(this));
        GameEvent.addEvent("Restart", this.onRestart.bind(this));
        GameEvent.addEvent("HitPlayer", this.onHitEffect.bind(this));
    }

    onRestart(isContinue)
    {
        if(isContinue) return;
        this.score.setText("0");
        this.isVisible = true;
    }

    onHide(isHomeMenuOn)
    {
        this.isVisible = !isHomeMenuOn;
    }

    onScored(score)
    {
        this.score.setText(score.toString());
    }
    
    onSetEnergy(count, isScaleEffect)
    {
        this.energy.text = count.toString();

        if(isScaleEffect)
        {
            if(this.energy.scaleX == 1)
            {
                GameUI.addAction(()=>
                {
                    this.energy.scaleX -= GameTime.deltaSeconds*0.7;
                    if(this.energy.scaleX < 1)
                    {
                        this.energy.scaleX = 1;
                        this.energy.scaleY = 1;
                        return 1;
                    }
                    this.energy.scaleY = this.energy.scaleX; 
                });
            }
            this.energy.scaleX = 1.7;
            this.energy.scaleY = this.energy.scaleX;
        }
    }

    onPrompt(text)
    {
        this.prompt.text = text;
        this.prompt.alpha = 1;
        this.prompt.top = this.bonusStart;

        if(this.time == -1)
        {
            GameUI.addAction(()=>
            {
                this.time += GameTime.deltaSeconds;
                let percentage = this.time / this.fadeOutTime;
                if(percentage >= 1 )
                {
                    this.time = -1;
                    this.prompt.alpha = 0;
                    return 1;
                }
                this.prompt.top = this.bonusStart - this.moveDist*percentage;
                this.prompt.alpha = 1 - percentage;
            });
        }
        this.time = 0;
    }

    onHitEffect()
    {
        if(!this.hitEffect.isVisible)
        {
            GameUI.addAction(()=>
            {
                this.hitEffect.alpha -= GameTime.deltaSeconds;
                if(this.hitEffect.alpha < 0)
                {
                    this.hitEffect.isVisible = false;
                    return 1;
                }
            });
        }
        this.hitEffect.isVisible = true;
        this.hitEffect.alpha = 1;
    }

    onScoreUpdate(score, bestScore, total)
    {
        this.best.setText("" + bestScore);
    }
}