import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';

const StyledText = styled(Typography)({
  padding: 0,
  border: 'none',
  outline: 'none',
  background: 'none',
  ':not([disabled])': {
    cursor: 'pointer',
    transition: 'opacity 100ms ease-in-out',
    ':hover': {
      opacity: 0.7
    }
  },
  ':not(:last-child)': {
    marginRight: 24
  }
});

export default class Region extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
  };

  onClick = () => this.props.onClick(this.props.value);

  render() {
    return (
      <StyledText
        component="button"
        variant="h6"
        disabled={this.props.selected}
        color={this.props.selected ? 'default' : 'textSecondary'}
        onClick={this.onClick}
      >
        {this.props.children}
      </StyledText>
    );
  }
}
