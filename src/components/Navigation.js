import * as React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Game from './Game';
import Leaderboard from './Leaderboard';
import Button from 'react-bootstrap/Button';
import {withRouter} from 'react-router-dom';

class Navigation extends React.Component {

    constructor(props) {
        super(props);
        // eslint-disable-next-line react/prop-types
        if (this.props.location.pathname === '/') {
            this.state = {
                nextPage: 'Leaderboard',
                currentPage: 'Home'
            };
        }
        // eslint-disable-next-line react/prop-types
        if (this.props.location.pathname === '/leaderboard') {
            this.state = {
                nextPage: 'Home',
                currentPage: 'Leaderboard'
            };
        }


        this.changePage = this.changePage.bind(this);
    }

    changePage() {
        const currentPageStore = this.state.currentPage;
        this.setState(() => ({
            nextPage: currentPageStore,
            currentPage: this.state.nextPage,
        }));
    }

    render() {
        return (
            <div className="container text-center">
                <Switch>
                    <Route path="/Leaderboard">
                        <Leaderboard/>
                    </Route>
                    <Route path="/">
                        <Game/>
                    </Route>
                </Switch>
                <div className='mt-5'/>
                {
                    this.state.nextPage === 'Home' && <LinkContainer onClick={this.changePage} to="/">
                        <Button variant="info">Return to Game</Button>
                    </LinkContainer>
                }
                {
                    this.state.nextPage === 'Leaderboard' && <LinkContainer onClick={this.changePage} to="/leaderboard">
                        <Button variant="info">View Leaderboard</Button>
                    </LinkContainer>
                }
            </div>
        );
    }
}


export default withRouter(Navigation);