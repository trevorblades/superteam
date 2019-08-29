import React, {Component, Fragment} from 'react';
import styled from '@emotion/styled';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import {HowToPlayTextA, HowToPlayTextB} from './how-to-play';
import {MdHelp} from 'react-icons/md';

const StyledButton = styled(Button)({
  marginRight: 8
});

export default class HelpButton extends Component {
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
        <StyledButton onClick={this.onClick}>
          <MdHelp size={20} style={{marginRight: 8}} />
          Help
        </StyledButton>
        <Dialog
          fullWidth
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
          scroll="body"
        >
          <DialogTitle>How to play</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              <HowToPlayTextA />
            </DialogContentText>
            <DialogContentText>
              <HowToPlayTextB />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.closeDialog}>
              Got it
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
