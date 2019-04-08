class BIPlatform 
{
    static init(gameName, numOfRequestedGames, devState) 
    {
		this.gameName = gameName;
		this.numOfRequestedGames = numOfRequestedGames;
		this.isPlayerInfoLoaded = false;

		let gameServer;
		if(devState == "developing")
			gameServer = 'https://dev.bananas.games';
		else if(devState == "testing")
			gameServer = 'https://test.bananas.games';
		else if(devState == "released")
			gameServer = 'https://bananas.games';
		else throw("BIPlatform Error: Wrong developing state '"+ devState +"'");

		let requestRouter='GamePromotion';
		this.url = gameServer+"/"+requestRouter;
		
		this.requestHeader = new Headers(
		{
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			"Access-Control-Allow-Headers": "X-Requested-With",
			"Access-Control-Request-Method": "POST"
		});	
    }

    static async fetchPromotedGamesAsync() 
    {
		if(!this.isPlayerInfoLoaded)
		{
			this.isPlayerInfoLoaded = true;
			let signedPlayerInfo = await FBInterface.getSignedPlayerInfoAsync();
			let playerID; 
			let signature;
			let gameName;
			
			if(signedPlayerInfo != undefined)
			{
				playerID = signedPlayerInfo.getPlayerID();
				signature = signedPlayerInfo.getSignature();
				gameName = this.gameName;
			}

			this.requestData = JSON.stringify(
			{
				'gameName': gameName,
				'numOfRequestedGames': this.numOfRequestedGames,
				'playerID': playerID,
				'signature': signature
			});
		}
		
		const gameRequest = new Request(this.url, 
		{
			method: 'POST',
			body: this.requestData,
			headers: this.requestHeader
		});
		
		let res = await fetch(gameRequest);

		return new Promise(function(resolve, reject)
		{
			if (!res.ok) return reject(new Error(res));
			else return resolve(res.json());
		});
    }
}