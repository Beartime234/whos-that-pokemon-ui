import axios from 'axios';

const apiUrl = 'https://api.whosthatpokemon.xyz/v1/';
const startApiPath = 'start';
const checkApiPath = 'check';

class GameSession {

    constructor() {
        this.session = this.refreshSession();
    }

    async refreshSession() {
        let startApiUrl = apiUrl + startApiPath;
        const res = await axios.post(startApiUrl, JSON.stringify({}), {headers: {'content-type': 'application/json'}});
        localStorage.setItem('SessionID', res.data['Session']['SessionID']);
        return res.data['Session'];
    }
}

class GameEngine {

    constructor() {
        this.startNewGame();
    }

    async startNewGame() {
        this.gameSession = new GameSession();
    }

    async guess(userGuess) {
        let checkApiUrl = apiUrl + checkApiPath;
        let sessionID = localStorage.getItem('SessionID');
        const res = await axios.post(checkApiUrl, JSON.stringify(
            {
                SessionId: sessionID,
                PokemonNameGuess: userGuess
            }
        ),
        {headers: {'content-type': 'application/json'}});
        return res.data;
    }
}

export {
    GameEngine
};