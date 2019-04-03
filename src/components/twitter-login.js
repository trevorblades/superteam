import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import io from 'socket.io-client';
import styled from '@emotion/styled';
import {FaTwitter} from 'react-icons/fa';
import {TWITTER_BLUE} from '../utils/constants';
import {mix} from 'polished';
import {stringify} from 'querystring';
import {userFromToken} from '../utils/user-from-storage';
import {withApollo} from 'react-apollo';
import {withTheme} from '@material-ui/core/styles';

const StyledButton = withTheme()(
  styled(Button)(({theme}) => {
    const {main, dark} = theme.palette.augmentColor({main: TWITTER_BLUE});
    return {
      color: 'white',
      backgroundColor: main,
      ':hover': {
        backgroundColor: mix(0.5, main, dark)
      }
    };
  })
);

class TwitterLogin extends Component {
  static propTypes = {
    text: PropTypes.string,
    client: PropTypes.object.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    text: 'Log in with Twitter'
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
      <StyledButton
        variant="contained"
        onClick={this.startAuth}
        disabled={this.state.pending}
        className={this.props.className}
      >
        <FaTwitter size={20} style={{marginRight: 8}} /> {this.props.text}
      </StyledButton>
    );
  }
}

export default withApollo(TwitterLogin);
