import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from '@emotion/styled';
import {FaRegStar, FaStar} from 'react-icons/fa';

const StyledCheckbox = styled(Checkbox)(props => ({
  marginLeft: -12,
  cursor: props.checked && 'default'
}));

export default class PrimaryCheckbox extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired
  };

  state = {
    dialogOpen: false
  };

  onChange = (event, checked) => {
    if (checked) {
      this.setState({
        dialogOpen: true
      });
    }
  };

  closeDialog = () => {
    this.setState({
      dialogOpen: false
    });
  };

  confirm = () => {
    console.log(this.props.value);
  };

  render() {
    return (
      <Fragment>
        <StyledCheckbox
          color="primary"
          disableRipple={this.props.checked}
          icon={<FaRegStar size={24} />}
          checkedIcon={<FaStar size={24} />}
          checked={this.props.checked}
          onChange={this.onChange}
        />
        <Dialog
          fullWidth
          maxWidth="xs"
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
        >
          <DialogTitle>Change primary team</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to make &quot;{this.props.name}&quot; your
              primary team?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog}>No</Button>
            <Button color="primary" onClick={this.confirm}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
