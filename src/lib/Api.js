import axios from 'axios';

const apiUrl = 'https://api.whosthatpokemon.xyz/v1/';
const startApiPath = 'start';
const checkApiPath = 'check';

async function start() {
    const startApiUrl = apiUrl + startApiPath;
    const res = await axios.post(startApiUrl, JSON.stringify({}), {headers: {'content-type': 'application/json'}});
    return res.data;
}

export async function check(userGuess) {
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

export {
    start
};