import React, {Component, Fragment} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

export default class StandingsExplainer extends Component {
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
        <a href="javascript:" onClick={this.onClick}>
          How does this work
        </a>
        <Dialog
          fullWidth
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
        >
          <DialogTitle>Ranking teams, explained 🧐</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              Our standings get updated every day, and teams are ranked based on
              a few different criteria: gain/loss (diff), total value, and total
              kill count.
            </DialogContentText>
            <DialogContentText>
              Gain/loss resets each quarter, but teams <strong>do</strong> carry
              over their values between quarters.
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
