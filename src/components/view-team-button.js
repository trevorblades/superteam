import Button from '@material-ui/core/Button';
import React, {Component, Fragment} from 'react';

export default class ViewTeamButton extends Component {
  render() {
    return (
      <Fragment>
        <Button size="small" variant="outlined">
          View team
        </Button>
      </Fragment>
    );
  }
}
