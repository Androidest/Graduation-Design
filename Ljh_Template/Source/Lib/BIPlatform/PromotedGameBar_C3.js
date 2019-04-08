class PromotedGameBar
{
	constructor(gameName,devState, numOfRequestedGames)
	{
		this.images = new Array(numOfRequestedGames);
		this.gameID = new Array(numOfRequestedGames);
		this.isEnabled = false;
		this.isLoaded = false;
		
		BIPlatform.init(gameName, numOfRequestedGames, devState);
    }
    
	fetch()
	{
		var bar = this;
		BIPlatform.fetchPromotedGamesAsync()
		.then((requestedGames)=>
		{
			if (requestedGames.length < BIPlatform.numOfRequestedGames)
				throw("Expected to promoted " + BIPlatform.numOfRequestedGames + "games, but only " + requestedGames.length + "games supplied!");
			else
				bar.retrieveData(requestedGames);
		})
		.catch(function(error) 
		{
			console.log("some error happened when fetching promoted games.");
			console.log(error);
		});
	}

	retrieveData(promotedGames)
	{
		for(let i=0; i<promotedGames.length; ++i)
		{
			this.images[i] = "data:image/png;base64,"+promotedGames[i].imgData;
			this.gameID[i] = promotedGames[i].gameID;
		}
		this.isEnabled = true;
		this.isLoaded = true;
	}

	onClickButton(index){ FBInterface.switchGameAsync(this.gameID[index]); }
}