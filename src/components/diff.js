import PropTypes from 'prop-types';
import React from 'react';
import {withTheme} from '@material-ui/core/styles';

function Diff(props) {
  let color;
  if (props.value) {
    const {error, secondary} = props.theme.palette;
    color = props.value < 0 ? error.dark : secondary.dark;
  }

  return (
    <span style={{color}}>
      {props.value > 0 ? '+' : ''}
      {props.value.toLocaleString()}
    </span>
  );
}

Diff.propTypes = {
  value: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme()(Diff);
