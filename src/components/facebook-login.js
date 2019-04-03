import FacebookLoginRenderProps from 'react-facebook-login/dist/facebook-login-render-props';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {ColoredButton} from './common';
import {FaFacebook} from 'react-icons/fa';
import {userFromToken} from '../utils/user-from-storage';
import {withApollo} from 'react-apollo';

class FacebookLogin extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    pending: false
  };

  onClick = () => {
    this.setState({
      pending: true
    });
  };

  onFailure = () => {
    this.setState({
      pending: false
    });
  };

  callback = async ({accessToken}) => {
    const response = await fetch(
      `${process.env.GATSBY_API_URL}/facebook/${accessToken}`
    );
    const token = await response.text();
    localStorage.setItem('token', token);
    this.props.client.writeData({
      data: {
        user: userFromToken(token)
      }
    });
  };

  render() {
    return (
      <FacebookLoginRenderProps
        autoLoad
        appId="2160925927333968"
        onClick={this.onClick}
        onFailure={this.onFailure}
        callback={this.callback}
        render={({onClick, isDisabled, isProcessing, isSdkLoaded}) => (
          <ColoredButton
            fullWidth
            hex="#3C5A99"
            disabled={
              isDisabled || isProcessing || !isSdkLoaded || this.state.pending
            }
            variant="contained"
            onClick={onClick}
          >
            <FaFacebook size={20} style={{marginRight: 8}} />
            Log in with Facebook
          </ColoredButton>
        )}
      />
    );
  }
}

export default withApollo(FacebookLogin);
