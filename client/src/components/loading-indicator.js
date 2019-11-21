import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {CircularProgress, Typography} from '@material-ui/core';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  padding: `${8}px 0`
});

const StyledText = styled(Typography)({
  marginLeft: 16
});

export default function LoadingIndicator(props) {
  return (
    <Container className={props.className}>
      <CircularProgress size={24} />
      <StyledText>Loading...</StyledText>
    </Container>
  );
}

LoadingIndicator.propTypes = {
  className: PropTypes.string
};
