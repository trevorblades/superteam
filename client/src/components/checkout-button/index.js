import CheckoutDialog from './checkout-dialog';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import {Button, Dialog} from '@material-ui/core';
import {MdShoppingCart} from 'react-icons/md';
import {TEAM_SIZE} from '../../utils/constants';

export default class CheckoutButton extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired
  };

  state = {
    dialogOpen: false
  };

  onClick = () => {
    this.setState({
      dialogOpen: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogOpen: false
    });
  };

  render() {
    return (
      <Fragment>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.onClick}
          disabled={this.props.players.length < TEAM_SIZE}
        >
          <MdShoppingCart size={20} style={{marginRight: 8}} />
          Checkout
        </Button>
        <Dialog
          fullWidth
          scroll="body"
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
        >
          <CheckoutDialog
            players={this.props.players}
            onClose={this.closeDialog}
          />
        </Dialog>
      </Fragment>
    );
  }
}
