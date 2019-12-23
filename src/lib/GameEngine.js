import {start, check} from './Api';

class GameSession {

    constructor() {
        this.session = this.refreshSession();
    }

    async refreshSession() {
        let res = await start();
        this.setSessionData(res['Session']['SessionID']);
        return res['Session'];
    }

    setSessionData(sessionID){
        localStorage.setItem('SessionID', sessionID);
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
        return await check(userGuess);
    }
}

export {
    GameEngine
};