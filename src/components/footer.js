import Colophon from './colophon';
import LogoTitle from './logo-title';
import React from 'react';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {PageWrapper, getSectionStyles} from './common';
import {Typography, withTheme} from '@material-ui/core';
import {navItems} from './header';
import {withProps} from 'recompose';

const Container = withTheme(
  styled.footer(getSectionStyles(24), ({theme}) => ({
    marginTop: 'auto',
    color: theme.palette.grey[600],
    backgroundColor: theme.palette.grey[100]
  }))
);

const StyledPageWrapper = withTheme(
  styled(PageWrapper)(({theme}) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse'
    }
  }))
);

const StyledLogoTitle = styled(LogoTitle)({
  marginLeft: -4
});

const StyledNav = withTheme(
  styled.nav(({theme}) => ({
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 8
    }
  }))
);

const NavGroup = styled.ul({
  margin: 0,
  marginBottom: 8,
  paddingLeft: 0,
  ':not(:last-child)': {
    marginRight: 48
  }
});

const Text = withProps({color: 'inherit'})(Typography);
const NavSubheader = withProps({
  component: 'li',
  variant: 'overline'
})(Text);

const NavItem = styled.li({
  listStyle: 'none',
  ':not(:last-child)': {
    marginBottom: 4
  }
});

const NavLink = styled(Text)({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline'
  }
});

const ExternalLink = withProps({
  component: 'a',
  target: '_blank',
  rel: 'noopener noreferrer'
})(NavLink);

export default function Footer() {
  return (
    <Container>
      <StyledPageWrapper>
        <div>
          <StyledLogoTitle vector color="inherit" />
          <Text variant="caption">
            <Colophon />
          </Text>
        </div>
        <StyledNav>
          <NavGroup>
            <NavSubheader>Get around</NavSubheader>
            {navItems.map(navItem => (
              <NavItem key={navItem.path}>
                <NavLink component={Link} to={navItem.path}>
                  {navItem.title}
                </NavLink>
              </NavItem>
            ))}
          </NavGroup>
          <NavGroup>
            <NavSubheader>Learn</NavSubheader>
            <NavItem>
              <NavLink component={Link} to="/#how-to-play">
                How to play
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink component={Link} to="/#prizes">
                Prizes
              </NavLink>
            </NavItem> */}
            <NavItem>
              <NavLink component={Link} to="/rules">
                Official rules
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink component={Link} to="/privacy">
                Privacy policy
              </NavLink>
            </NavItem>
          </NavGroup>
          <NavGroup>
            <NavSubheader>Connect</NavSubheader>
            <NavItem>
              <ExternalLink href="https://twitter.com/superteamgg">
                Twitter
              </ExternalLink>
            </NavItem>
            <NavItem>
              <ExternalLink href="https://instagram.com/superteamgg">
                Instagram
              </ExternalLink>
            </NavItem>
            <NavItem>
              <ExternalLink href="https://facebook.com/superteamgg">
                Facebook
              </ExternalLink>
            </NavItem>
          </NavGroup>
        </StyledNav>
      </StyledPageWrapper>
    </Container>
  );
}
