import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {PageWrapper, Section} from './common';
import {withTheme} from '@material-ui/core/styles';

const StyledSection = withTheme(
  styled(Section)(({theme}) => ({
    color: 'white',
    backgroundImage: `linear-gradient(to right, ${
      theme.palette.primary.main
    }, ${theme.palette.error.main})`
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
