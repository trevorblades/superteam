import React from 'react';
import styled from '@emotion/styled';
import {Button, Hidden, Typography, withTheme} from '@material-ui/core';
import {Link} from 'gatsby';
import {PageWrapper, Section} from './common';

const StyledSection = withTheme(
  styled(Section)(({theme}) => ({
    color: 'white',
    backgroundImage: `linear-gradient(${[
      'to right',
      theme.palette.primary.main,
      theme.palette.error.main
    ]})`
  }))
);

const TextWrapper = styled.div({
  marginRight: 'auto'
});

const StyledPageWrapper = styled(PageWrapper)({
  display: 'flex',
  alignItems: 'center'
});

const StyledButton = styled(Button)({
  marginLeft: 8
});

export default function Banner() {
  return (
    <StyledSection
      padding={{
        lg: 16,
        md: 16,
        sm: 12,
        xs: 12
      }}
    >
      <StyledPageWrapper>
        <TextWrapper>
          <Typography color="inherit" variant="h6">
            Q2 Challenge: 1 April - 30 June 2019
          </Typography>
        </TextWrapper>
        <Hidden smDown implementation="css">
          <StyledButton component={Link} to="/standings" color="inherit">
            Standings
          </StyledButton>
          <StyledButton href="#prizes" variant="outlined" color="inherit">
            Prizes
          </StyledButton>
        </Hidden>
      </StyledPageWrapper>
    </StyledSection>
  );
}
