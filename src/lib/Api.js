import axios from 'axios';

const apiUrl = 'https://api.whosthatpokemon.xyz/v1/';
const startApiPath = 'start';
const checkApiPath = 'check';
const leaderboardApiPath = 'leaderboard';
const nameApiPath = 'name';

async function start() {
    const startApiUrl = apiUrl + startApiPath;
    const res = await axios.post(startApiUrl, JSON.stringify({}), {headers: {'content-type': 'application/json'}});
    return res.data;
}

async function check(userGuess) {
    const checkApiUrl = apiUrl + checkApiPath;
    const sessionID = localStorage.getItem('SessionID');
    const res = await axios.post(checkApiUrl, JSON.stringify(
        {
            SessionId: sessionID,
            PokemonNameGuess: userGuess
        }
    ),
    {headers: {'content-type': 'application/json'}});
    return res.data;
}

async function name(userGuess) {
    const nameApiUrl = apiUrl + nameApiPath;
    const sessionID = localStorage.getItem('SessionID');
    const res = await axios.post(nameApiUrl, JSON.stringify(
        {
            SessionId: sessionID,
            UserName: userGuess
        }
    ),
    {headers: {'content-type': 'application/json'}});
    return res.data;
}

async function leaderboard() {
    const leaderboardApiUrl = apiUrl + leaderboardApiPath;
    const res = await axios.get(leaderboardApiUrl);
    return res.data;
}

export {
    start,
    check,
    leaderboard,
    name
};