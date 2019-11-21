import LoginButton from '../login-button';
import LogoTitle from '../logo-title';
import MobileNav from './mobile-nav';
import React from 'react';
import UserMenu from './user-menu';
import WithUser from '../with-user';
import styled from '@emotion/styled';
import {
  AppBar,
  Hidden,
  NoSsr,
  Toolbar,
  Typography,
  makeStyles,
  withTheme
} from '@material-ui/core';
import {GRID_SPACING} from '../../utils/constants';
import {Link} from 'gatsby';
import {PageWrapper} from '../common';
import {compose, mapProps, withProps} from 'recompose';

const StyledToolbar = withTheme(
  styled(Toolbar)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
      padding: `0 ${GRID_SPACING}px`
    }
  }))
);

const StyledPageWrapper = styled(PageWrapper)({
  display: 'flex',
  alignSelf: 'stretch'
});

const Nav = styled.nav({
  display: 'flex',
  height: '100%',
  marginLeft: -8
});

const NavItem = compose(
  withTheme,
  withProps({variant: 'subtitle1'})
)(
  styled(Typography)(({theme}) => {
    const {main} = theme.palette.primary;
    return {
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${8}px`,
      borderBottom: '2px solid transparent',
      textDecoration: 'none',
      ':not(:last-child)': {
        marginRight: 16
      },
      '&.active': {
        color: main,
        borderColor: main
      }
    };
  })
);

function isActive(className) {
  return ({href, location}) => {
    const isCurrent =
      href === location.pathname ||
      href === location.pathname.replace(/\/$/, '');
    return {
      className: className + (isCurrent ? ' active' : '')
    };
  };
}

const NavLink = mapProps(({className, ...props}) => ({
  ...props,
  getProps: isActive(className)
}))(Link);

const MobileNavWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%'
});

const Action = withTheme(
  styled.div(({theme}) => ({
    margin: 'auto',
    marginRight: 0,
    [theme.breakpoints.only('sm')]: {
      marginRight: 16
    },
    [theme.breakpoints.only('xs')]: {
      marginRight: 8
    }
  }))
);

export const navItems = [
  {
    path: '/',
    title: 'Home'
  },
  {
    path: '/create',
    title: 'Create team'
  },
  {
    path: '/standings',
    title: 'Standings'
  }
];

const useStyles = makeStyles(({breakpoints}) => ({
  logoTitle: {
    [breakpoints.up('md')]: {
      transform: 'translate(-50%, -50%)'
    }
  }
}));

export default function Header() {
  const {logoTitle} = useStyles();
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <StyledToolbar>
        <StyledPageWrapper centered>
          <Hidden smDown implementation="css">
            <Nav>
              {navItems.map(navItem => (
                <NavItem
                  component={NavLink}
                  to={navItem.path}
                  key={navItem.path}
                >
                  {navItem.title}
                </NavItem>
              ))}
            </Nav>
          </Hidden>
          <Hidden mdUp implementation="css">
            <MobileNavWrapper>
              <MobileNav items={navItems} />
            </MobileNavWrapper>
          </Hidden>
          <LogoTitle
            className={logoTitle}
            fontSize={34}
            top="50%"
            left="50%"
            position={{
              xs: 'static',
              md: 'absolute'
            }}
          />
          <NoSsr>
            <Action>
              <WithUser>
                {({user}) =>
                  user ? <UserMenu user={user} /> : <LoginButton />
                }
              </WithUser>
            </Action>
          </NoSsr>
        </StyledPageWrapper>
      </StyledToolbar>
    </AppBar>
  );
}
