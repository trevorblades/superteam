import ButtonBase from '@material-ui/core/ButtonBase';
import MenuButton from '../menu-button';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import {Avatar} from '@material-ui/core';
import {Link} from 'gatsby';
import {withApollo} from 'react-apollo';

class UserMenu extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  logout = () => {
    localStorage.removeItem('token');
    this.props.client.writeData({
      data: {
        user: null
      }
    });
    this.props.client.resetStore();
  };

  render() {
    return (
      <MenuButton
        renderButton={openMenu => (
          <Tooltip title={`Logged in as ${this.props.user.displayName}`}>
            <Avatar
              component={ButtonBase}
              src={this.props.user.profileImage}
              alt={this.props.user.displayName}
              onClick={openMenu}
            />
          </Tooltip>
        )}
      >
        <MenuItem component={Link} to="/teams">
          My teams
        </MenuItem>
        <MenuItem component={Link} to="/settings">
          Settings
        </MenuItem>
        <MenuItem onClick={this.logout}>Log out</MenuItem>
      </MenuButton>
    );
  }
}

export default withApollo(UserMenu);
