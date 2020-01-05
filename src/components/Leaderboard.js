import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {leaderboard, name} from '../lib/Api';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {GameEngine} from '../lib/GameEngine';

class Leaderboard extends Component {

    gameEngine = new GameEngine();

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            list: [],
            confirmText: 'Confirm',
            confirmButtonStyle: 'outline-success'
        };
        this.updateUsername = this.updateUsername.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
    }

    async componentDidMount() {
        const session = await this.gameEngine.gameSession.session;
        const res = await leaderboard();
        const leaderboardArray = res['Leaderboard'];
        this.setState({
            list:leaderboardArray,
            username: session['UserName']
        });
    }

    setUsername(name) {
        this.setState(() => ({ username: name}));  // Setting users username
    }

    handleUsernameChange(e) {
        this.setState(() => ({confirmText: 'Confirm', confirmButtonStyle: 'outline-success'}));
        const value = e.target.value;
        this.setUsername(value);
    }

    async updateUsername() {
        this.setState(() => ({confirmText: 'Loading...', confirmButtonStyle: 'outline-success'}));
        try {
            await name(this.state.username);
        } catch (e) {
            this.setState(() => ({confirmText: 'Error', confirmButtonStyle: 'danger'}));
            return;
        }
        this.setState(() => ({confirmText: 'Success', confirmButtonStyle: 'success'}));
    }

    render() {
        let userlist = this.state.list.map((user, i) => <User key={i} username={ user['UserName'] } rank={ i + 1 } score={ user['Score']} />);

        return (
            <div className="container leaderboard">
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon3">
                            Username
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        id="basic-url" aria-describedby="basic-addon3" value={this.state.username}
                        onChange={this.handleUsernameChange}
                    />
                    <InputGroup.Append>
                        <Button onClick={this.updateUsername} variant={this.state.confirmButtonStyle}>{this.state.confirmText}</Button>
                    </InputGroup.Append>
                </InputGroup>
                <LeaderboardHeader />
                <ColumnHeader />
                { userlist }
            </div>
        );
    }

}

const LeaderboardHeader = () => {
    return (
        <div className="leadheader">
            <h2>Leaderboard</h2>
        </div>
    );
};

const ColumnHeader = () => (
    <div className="row colheader ">
        <div className="col-xs-2 col-md-2 ">
            <h2>#</h2>
        </div>
        <div className="col-xs-6 col-md-6">
            <h2>Username</h2>
        </div>
        <div className="col-xs-3 col-md-3 ">
            <h2>Score</h2>
        </div>
    </div>
);

const User = ({ rank, username, score }) => {
    return (
        <div className="row users vcenter">
            <div className="col-xs-2 col-md-2 rank">
                <h4>{ rank }</h4>
            </div>
            <div className="col-xs-6 col-md-6 username">
                <h4>{ username }</h4>
            </div>
            <div className="col-xs-3 col-md-3 score">
                <h4>{ score }</h4>
            </div>
        </div>
    );
};

User.propTypes = {
    rank: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired
};

export default Leaderboard;