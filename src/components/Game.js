import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GameEngine } from '../lib/GameEngine';
import Img from 'react-image';
import ClipLoader from 'react-spinners/ClipLoader';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

const instructionsPopover = (
    <Popover id="popover-basic">
        <Popover.Title as="h3">Instructions</Popover.Title>
        <Popover.Content>
            Type the Pokémon&apos;s name in the input box below. Select guess when you think you are correct. The color of the text will turn red if your wrong.
            If you are correct a new Pokémon will be shown. Hit skip if you do not know the answer. The previous pokemon is shown on the upper left of the game display.
            Your spelling can be a little bit off and still be correct.<br/>
            <strong>Shortcuts</strong> <br/>
            Enter -&gt; Submit <br/>
            / -&gt; Skip
        </Popover.Content>
    </Popover>
);

const scorePopover = (
    <Popover id="popover-basic">
        <Popover.Title as="h3">Score</Popover.Title>
        <Popover.Content>
            You get +1 for every correct answer and -1 for every skip. You cannot go below 0.
        </Popover.Content>
    </Popover>
);

const restartPopover = (
    <Popover id="popover-basic">
        <Popover.Title as="h3">Restart</Popover.Title>
        <Popover.Content>
            This restarts the game. Be careful your score cannot be recovered.
        </Popover.Content>
    </Popover>
);

const gameEngine = new GameEngine();

class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guess: props.guess,
            currentPokemonImage: props.currentPokemonImage,
            currentPokemonName: props.currentPokemonName,
            nextPokemonImage: props.nextPokemonImage,
            prevPokemonImage: props.prevPokemonImage,
            prevPokemonName: props.prevPokemonName,
            score: props.score,
            isCorrect: props.isCorrect,
        };

        this.guessPokemon = this.guessPokemon.bind(this);
        this.skipPokemon = this.skipPokemon.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    async componentDidMount() {
        const session = await gameEngine.gameSession.session;
        this.updateGame(session, '');
    }

    setPokemonImage(currentPokemonImageUrl, nextPokemonImageUrl, prevPokemonImageUrl) {
        this.setState(() => ({
            currentPokemonImage: currentPokemonImageUrl,
            nextPokemonImage: nextPokemonImageUrl,
            prevPokemonImage: prevPokemonImageUrl,
        }));  // Setting pokemon images
    }

    setScore(score) {
        this.setState(() => ({ score: score}));  // Setting score
    }

    setPrevPokemonName(name) {
        this.setState(() => ({ prevPokemonName: name.charAt(0).toUpperCase() + name.slice(1)}));  // Setting prev pokemon name
    }

    async guessPokemon() {
        const guessOutcome = await gameEngine.guess(this.state.guess);
        const correct = guessOutcome['Correct'];
        if (correct === true) {
            this.setState(() => ({ isCorrect: true }));
            this.updateGame(guessOutcome['Session'], '');
        } else {
            this.setState(() => ({ isCorrect: false }));
        }
    }

    async skipPokemon() {
        const guessOutcome = await gameEngine.guess('SKIP');
        this.updateGame(guessOutcome['Session'], '');
    }

    async restartGame() {
        const session = await gameEngine.startNewGame();
        this.updateGame(session, '');
    }

    updateGame(session, guess) {
        let prevPokemon  = session['PreviousPokemon'];
        if (prevPokemon === null) {
            prevPokemon = {'OriginalImageUrl': '', 'Name': ''};
        }
        this.setPokemonImage(session['CurrentPokemon']['BWImageUrl'], session['NextPokemon']['BWImageUrl'], prevPokemon['OriginalImageUrl']);
        this.setScore(session['Score']);
        this.setPrevPokemonName(prevPokemon['Name']);
        this.setState(() => ({ guess: guess }));
    }

    handleChange(event) {
        const guess = event.target.value;
        if (guess === '/') {
            event.target.value = '';
            this.setState(() => ({ guess: '' }));
        } else {
            this.setState(() => ({ guess: guess }));
        }
        if (this.state.isCorrect === false) {
            this.setState(() => ({ isCorrect: true }));
        }
    }

    async handleKeyPress(event) {
        if (event.key === 'Enter') {
            await this.guessPokemon();
        }
        if (event.key === '/') {
            await this.skipPokemon();
        }
    }


    startGame() {
        gameEngine.startNewGame();
        this.setState(() => ({ outcome: '', guess: 0 }));
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-5 mx-auto">
                        {
                            <div>
                                <div className="row mx-auto">
                                    <div className="col-md-4 mx-auto game-display score-display">
                                        <OverlayTrigger placement="left" overlay={scorePopover}>
                                            <Button variant="info">Score <Badge variant="light">{this.state.score}</Badge></Button>
                                        </OverlayTrigger>
                                    </div>
                                    <div className="col-md-4 mx-auto game-display restart-display">
                                        <OverlayTrigger placement="top" overlay={restartPopover}>
                                            <Button onClick={this.restartGame} variant="danger">
                                                <i className="fa fa-lg fa-refresh" aria-hidden="true"/>
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                    <div className="col-md-4 mx-auto game-display instruction-display">
                                        <OverlayTrigger placement="right" overlay={instructionsPopover}>
                                            <Button variant="info">Instructions</Button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="mt-2"/>
                                <div className="row mx-auto">
                                    <div className="col-md-3 game-display pokemon-image-prev">
                                        <Img
                                            src={[this.state.prevPokemonImage]}
                                            loader={<ClipLoader color={'black'} size={25}/>}
                                            height={100}
                                        />
                                        <h6>{this.state.prevPokemonName}</h6>
                                    </div>
                                    <div className="col-md-6 game-display pokemon-image">
                                        <Img
                                            src={[this.state.currentPokemonImage]}
                                            loader={<ClipLoader color={'black'} size={50}/>}
                                        />
                                    </div>
                                    <div className="col-md-3 game-display pokemon-image"/>
                                    <div style={{'visibility': 'hidden', 'width': 0, 'height': 0, 'overflow': 'hidden'}}>
                                        <Img
                                            src={[this.state.nextPokemonImage]}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input type="string" className="form-control game-display "
                                        style={{color: this.state.isCorrect ? 'black': 'red'}}
                                        placeholder="Pokémon Name"
                                        onChange={this.handleChange}
                                        onKeyPress={this.handleKeyPress}
                                        value={this.state.guess} />
                                </div>
                                <div className="form-group">
                                    <button onClick={this.guessPokemon} className="btn btn-lg btn-success btn-block">Guess</button>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-lg btn-danger  btn-block"
                                        onClick={this.skipPokemon}>Skip</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Game.defaultProps = {
    guess: '',
    currentPokemonImage: '',
    currentPokemonName: '',
    nextPokemonImage: '',
    prevPokemonImage: '',
    prevPokemonName: '',
    score: 0,
    isCorrect: true,
};

Game.propTypes = {
    guess: PropTypes.string,
    currentPokemonImage: PropTypes.string,
    currentPokemonName: PropTypes.string,
    nextPokemonImage: PropTypes.string,
    prevPokemonImage: PropTypes.string,
    prevPokemonName: PropTypes.string,
    score: PropTypes.number,
    isCorrect: PropTypes.bool,
};

export default Game;