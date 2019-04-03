import PropTypes from 'prop-types';
import React, {Component} from 'react';
import io from 'socket.io-client';
import {ColoredButton} from './common';
import {FaTwitter} from 'react-icons/fa';
import {stringify} from 'querystring';
import {userFromToken} from '../utils/user-from-storage';
import {withApollo} from 'react-apollo';

class TwitterLogin extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    pending: false
  };

  dialog = null;

  componentDidMount() {
    this.socket = io(process.env.GATSBY_API_URL);
    this.socket.on('token', token => {
      this.dialog.close();
      localStorage.setItem('token', token);
      this.props.client.writeData({
        data: {
          user: userFromToken(token)
        }
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.check);
  }

  checkDialog() {
    this.check = setInterval(() => {
      if (
        !this.dialog ||
        this.dialog.closed ||
        this.dialog.closed === undefined
      ) {
        clearInterval(this.check);
        this.setState({pending: false});
      }
    }, 1000);
  }

  openDialog() {
    const width = 600;
    const height = 600;
    return window.open(
      `${process.env.GATSBY_API_URL}/twitter?socketId=${this.socket.id}`,
      '',
      stringify(
        {
          width,
          height,
          top: window.innerHeight / 2 - height / 2,
          left: window.innerWidth / 2 - width / 2,
          toolbar: 'no',
          location: 'no',
          directories: 'no',
          status: 'no',
          menubar: 'no',
          scrollbars: 'no',
          resizable: 'no',
          copyhistory: 'no'
        },
        ','
      )
    );
  }

  startAuth = () => {
    if (!this.state.pending) {
      this.dialog = this.openDialog();
      this.checkDialog();
      this.setState({pending: true});
    }
  };

  render() {
    return (
      <ColoredButton
        fullWidth
        hex="#38a1f3"
        variant="contained"
        size="large"
        onClick={this.startAuth}
        disabled={this.state.pending}
      >
        <FaTwitter size={20} style={{marginRight: 8}} /> Log in with Twitter
      </ColoredButton>
    );
  }
}

export default withApollo(TwitterLogin);
