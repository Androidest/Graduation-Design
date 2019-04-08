class ScoreHUD extends Rectangle
{
    constructor(x,y,w,h,imgName)
    {
        let fontSize = h*0.8;
        let imSize = fontSize * 0.9 +"px";

        super(x+"px", y+"px", w+"px", h+"px");
        this.background = "#444444";
        this.alpha = 0.7;
        this.cornerRadius = fontSize * 0.5;

        let img = new ImageRect(h*0.3+"px", h*0.14+"px", imSize, imSize);
        img.setImage(imgName);
        this.addChild(img);

        this.score = new TextBlock(0, 0, 0.95, 1);
        this.score.fontStyle = "bold";
        this.score.fontFamily = "MainFont";
        this.score.fontSize = fontSize;
        this.score.textHorizontalAlignment = AlignRight;
        this.addChild(this.score);
    }

    setText(text) { this.score.text = text + "m"; }
    setColor(color) { this.score.color = color; }
}