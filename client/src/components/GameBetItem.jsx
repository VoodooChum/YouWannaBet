import React from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from '@material-ui/core/IconButton';

class GameBetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bet: {},
      accepted: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    const { betInfo } = this.props;
    console.log(betInfo);
    const betObj = {};
    this.getUserById(betInfo.id_user_acceptor)
      .then((user) => {
        betObj.acceptor = user.username;
        this.getUserById(betInfo.id_user_poster)
          .then((user2) => {
            betObj.poster = user2.username;
            betObj.amount = betInfo.amount;
            betObj.id = betInfo.id_bet;
            this.setState({ bet: betObj });
          });
      });
  }

  onClick() {
    axios.patch(`/api/bets?id=${this.state.bet.id}&acceptor=6`).then((result) => {
      console.log(result);
      this.setState({ accepted: true });
    }).catch((err) => {
      console.log(err);
    });
  }

  getUserById(userId) {
    return axios.get(`/api/userInfo/${userId}`)
      .then(user => user.data.rows[0])
      .catch(error => console.log(error));
  }

  render() {
    if (!this.state.bet.acceptor) {
      return (
        <div>
          {this.state.bet.poster} bet against {this.state.bet.acceptor} for {this.state.bet.amount}.
        </div>
      );
    }
    return (
      <div>
        {this.state.bet.poster} has bet {this.state.bet.amount} for the Home Team to win.
        <IconButton onClick={this.onClick}>{this.state.accepted ? 'Accepted' : 'Accept Bet'}</IconButton>
      </div>
    );
  }
}

export default GameBetItem;

// additional component to accept and post bets
// render single game info
// home team and away team
// bets that are posted, but not yet accepted
// option to post your own bet
