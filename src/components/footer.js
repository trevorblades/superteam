import Colophon from './colophon';
import LastUpdated from './last-updated';
import LogoTitle from './logo-title';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
import {Link} from 'gatsby';
import {PageWrapper, getSectionStyles} from './common';
import {navItems} from './header';
import {withTheme} from '@material-ui/core/styles';

const Container = withTheme()(
  styled.footer(getSectionStyles(24), ({theme}) => ({
    marginTop: 'auto',
    color: theme.palette.grey[600],
    backgroundColor: theme.palette.grey[100]
  }))
);

const StyledPageWrapper = withTheme()(
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

const StyledNav = withTheme()(
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

export default function Footer() {
  return (
    <Container>
      <StyledPageWrapper>
        <div>
          <StyledLogoTitle vector color="inherit" />
          <Text variant="caption">
            <Colophon />. <LastUpdated />
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
            <NavItem>
              <NavLink component={Link} to="/#prizes">
                Prizes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink component={Link} to="/rules">
                Official rules
              </NavLink>
            </NavItem>
          </NavGroup>
          <NavGroup>
            <NavSubheader>Connect</NavSubheader>
            <NavItem>
              <NavLink component="a" href="https://twitter.com/superteamgg">
                Twitter
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink component="a" href="https://instagram.com/superteamgg">
                Instagram
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink component="a" href="https://facebook.com/superteamgg">
                Facebook
              </NavLink>
            </NavItem>
          </NavGroup>
        </StyledNav>
      </StyledPageWrapper>
    </Container>
  );
}
