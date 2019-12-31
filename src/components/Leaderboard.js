import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { leaderboard } from '../lib/Api';

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    async componentDidMount() {
        const res = await leaderboard();
        const leaderboardArray = res['Leaderboard'];
        this.setState({
            list:leaderboardArray
        });
    }

    render() {
        let userlist = this.state.list.map((user, i) => <User key={i} username={ user['UserName'] } rank={ i + 1 } score={ user['Score']} />);

        return (
            <div className="container leaderboard">
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