import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';

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
