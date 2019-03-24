import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';

export default class MenuButton extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    renderButton: PropTypes.func.isRequired
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

  render() {
    return (
      <Fragment>
        {this.props.renderButton(this.openMenu)}
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
          {this.props.children}
        </Menu>
      </Fragment>
    );
  }
}
