import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, {Component, Fragment} from 'react';

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
          <DialogTitle>Our standings, explained 🧐</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              Standings get updated every day, and player ranks are calculated
              based on a few different criteria: gain/loss (diff), total current
              value, and total kill count.
            </DialogContentText>
            <DialogContentText>
              Gain/loss resets each quarter, but teams <strong>do</strong> carry
              their values over between quarters.
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
