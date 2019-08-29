import MenuButton from '../menu-button';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Avatar, ButtonBase, MenuItem, Tooltip} from '@material-ui/core';
import {Link} from 'gatsby';
import {withApollo} from '@apollo/react-hoc';

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
          <Tooltip title={`Logged in as ${this.props.user.name}`}>
            <Avatar
              component={ButtonBase}
              src={this.props.user.image}
              alt={this.props.user.name}
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
