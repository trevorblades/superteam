import Button from '@material-ui/core/Button';
import CheckoutDialog from './checkout-dialog';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from '@emotion/styled';
import {MdShoppingCart} from 'react-icons/md';
import {TEAM_SIZE} from '../../utils/constants';

const StyledButton = styled(Button)({
  marginLeft: 16
});

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
        <StyledButton
          variant="contained"
          color="secondary"
          onClick={this.onClick}
          disabled={this.props.players.length < TEAM_SIZE}
        >
          <MdShoppingCart size={20} style={{marginRight: 8}} />
          Checkout
        </StyledButton>
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
