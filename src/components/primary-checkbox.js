import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from '@emotion/styled';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import {FaRegStar, FaStar} from 'react-icons/fa';
import {LIST_ENTRIES, SET_PRIMARY_ENTRY} from '../utils/queries';
import {Mutation} from '@apollo/react-components';

const StyledCheckbox = styled(Checkbox)(props => ({
  marginLeft: -12,
  cursor: props.checked && 'default'
}));

function updateEntries(cache, {data}) {
  const {entries} = cache.readQuery({query: LIST_ENTRIES});
  cache.writeQuery({
    query: LIST_ENTRIES,
    data: {
      entries: entries.map(entry =>
        entry.id === data.setPrimaryEntry.id
          ? entry
          : {
              ...entry,
              primary: false
            }
      )
    }
  });
}

export default class PrimaryCheckbox extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
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
          <Mutation
            mutation={SET_PRIMARY_ENTRY}
            variables={{id: this.props.id}}
            update={updateEntries}
            onCompleted={this.closeDialog}
          >
            {(setPrimaryEntry, {loading}) => (
              <DialogActions>
                <Button onClick={this.closeDialog}>No</Button>
                <Button
                  disabled={loading}
                  color="primary"
                  onClick={setPrimaryEntry}
                >
                  Yes
                </Button>
              </DialogActions>
            )}
          </Mutation>
        </Dialog>
      </Fragment>
    );
  }
}
