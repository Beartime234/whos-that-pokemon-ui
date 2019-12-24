import {start, check} from './Api';

class GameSession {

    constructor() {
        this.session = this.refreshSession();
    }

    async refreshSession() {
        let currentSession = this.getCurrentSession();
        if (currentSession !== {}) {
            return currentSession;
        }
        return await this.getNewSession();
    }

    async getCurrentSession() {
        if (localStorage.getItem('SessionID') !== null) {  // Has the user already got a session? If so we load it
            let res = await check('');
            return res['Session'];
        }
        return {};
    }

    async getNewSession() {
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
        this.gameSession = new GameSession();
    }

    async startNewGame() {
        return await this.gameSession.getNewSession();
    }

    async guess(userGuess) {
        return await check(userGuess);
    }
}

export {
    GameEngine
};