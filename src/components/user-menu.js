import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import {Link} from 'gatsby';
import {withApollo} from 'react-apollo';

class UserMenu extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  state = {
    anchorEl: null
  };

  openMenu = event => {
    this.setState({
      anchorEl: event.target
    });
  };

  closeMenu = () => {
    this.setState({
      anchorEl: null
    });
  };

  logout = () => {
    localStorage.removeItem('token');
    this.props.client.writeData({
      data: {
        user: null
      }
    });
  };

  render() {
    return (
      <Fragment>
        <Tooltip title={`Logged in as ${this.props.user.displayName}`}>
          <Avatar
            component={ButtonBase}
            src={this.props.user.profileImage}
            alt={this.props.user.displayName}
            onClick={this.openMenu}
          />
        </Tooltip>
        <Menu
          disableRestoreFocus
          disableAutoFocusItem
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.closeMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuItem component={Link} to="/entries">
            My teams
          </MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={this.logout}>Log out</MenuItem>
        </Menu>
      </Fragment>
    );
  }
}

export default withApollo(UserMenu);
