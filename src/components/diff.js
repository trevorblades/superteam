import PropTypes from 'prop-types';
import React from 'react';
import {formatMoney} from '../utils/format';
import {withTheme} from '@material-ui/core/styles';

function Diff(props) {
  if (!props.value) {
    return <span>Even</span>;
  }

  const {error, secondary} = props.theme.palette;
  const color = props.value < 0 ? error.dark : secondary.dark;
  const sign = props.value > 0 ? '+' : '-';
  return (
    <span style={{color}}>
      {sign}
      {formatMoney(Math.abs(props.value))}
    </span>
  );
}

Diff.propTypes = {
  value: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme()(Diff);
