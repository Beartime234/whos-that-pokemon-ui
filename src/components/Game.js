import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GameEngine } from '../lib/GameEngine';
import Img from 'react-image';
import ClipLoader from 'react-spinners/ClipLoader';

const gameEngine = new GameEngine();

class Game extends Component {

    constructor(props) {
        super();

        this.state = {
            guess: props.guess,
            currentPokemonImage: props.currentPokemonImage,
            nextPokemonImage: props.nextPokemonImage,
            score: props.score,
            isCorrect: props.isCorrect
        };

        this.guessPokemon = this.guessPokemon.bind(this);
        this.skipPokemon = this.skipPokemon.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    async componentDidMount() {
        const session = await gameEngine.gameSession.session;
        this.setPokemonImage(session['CurrentPokemon']['BWImageUrl'], session['NextPokemon']['BWImageUrl']);
        this.setScore(session['Score']);
    }

    setPokemonImage(currentPokemonImageUrl, nextPokemonImageUrl) {
        this.setState(() => ({ currentPokemonImage: currentPokemonImageUrl, nextPokemonImage: nextPokemonImageUrl}));  // Setting image
    }

    setScore(score) {
        this.setState(() => ({ score: score}));  // Setting score
    }

    async guessPokemon() {
        const guessOutcome = await gameEngine.guess(this.state.guess);
        const correct = guessOutcome['Correct'];
        if (correct === true) {
            this.setState(() => ({ isCorrect: true }));
            this.setPokemonImage(guessOutcome['Session']['CurrentPokemon']['BWImageUrl'], guessOutcome['Session']['NextPokemon']['BWImageUrl']);
            this.setScore(guessOutcome['Session']['Score']);
            this.setState(() => ({ guess: '' }));
        } else {
            this.setState(() => ({ isCorrect: false }));
        }
    }

    async skipPokemon() {
        const guessOutcome = await gameEngine.guess('SKIP');
        this.setPokemonImage(guessOutcome['Session']['CurrentPokemon']['BWImageUrl'], guessOutcome['Session']['NextPokemon']['BWImageUrl']);
        this.setScore(guessOutcome['Session']['Score']);
        this.setState(() => ({ guess: '' }));
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


    outcomeClass() {
        return 'indicator--blue fa fa-thermometer-0 fa-2x';
    }

    startGame() {
        gameEngine.startNewGame();
        this.setState(() => ({ outcome: '', guess: 0 }));
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        {
                            this.state.outcome !== 'you win' && <div>
                                <div className="form-group">
                                    <ul className="nav nav-pills nav-fill">
                                    </ul>
                                </div>
                                <div className="game-display score-display">
                                    {this.state.score}
                                </div>
                                <div className="game-display">
                                    <Img
                                        src={[this.state.currentPokemonImage]}
                                        loader={<ClipLoader color={'black'} size={50}/>}
                                    />
                                </div>
                                <div className="game-display" style={{'visibility': 'hidden', 'width': 0, 'height': 0, 'overflow': 'hidden'}}>
                                    <Img
                                        src={[this.state.nextPokemonImage]}
                                    />
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
                        {
                            this.state.outcome && this.state.outcome !== 'you win' &&
                            <div className="form-group">
                                <div className="game-outcome">
                                    <p>{this.state.outcome}</p>
                                    <i className={`${this.outcomeClass()}`} />
                                </div>
                            </div>
                        }
                        {
                            this.state.outcome === 'you win' && <div className="form-group">
                                <div className="game-outcome">
                                    <p>{this.state.outcome}</p>
                                    <button className="btn btn-lg btn-success btn-block"
                                        onClick={this.startGame}>PLAY AGAIN</button>
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
    nextPokemonImage: '',
    score: 0,
    isCorrect: true
};

Game.propTypes = {
    guess: PropTypes.string,
    currentPokemonImage: PropTypes.string,
    nextPokemonImage: PropTypes.string,
    score: PropTypes.number,
    isCorrect: PropTypes.bool
};

export default Game;