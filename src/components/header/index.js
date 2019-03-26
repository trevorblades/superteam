import AppBar from '@material-ui/core/AppBar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Hidden from '@material-ui/core/Hidden';
import LogoTitle from '../logo-title';
import MobileNav from './mobile-nav';
import NoSsr from '@material-ui/core/NoSsr';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import TwitterLogin from '../twitter-login';
import Typography from '@material-ui/core/Typography';
import UserMenu from './user-menu';
import WithUser from '../with-user';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
import {Avatar} from '@material-ui/core';
import {FaTwitter} from 'react-icons/fa';
import {GRID_SPACING, TWITTER_BLUE} from '../../utils/constants';
import {Link} from 'gatsby';
import {PageWrapper} from '../common';
import {withTheme} from '@material-ui/core/styles';

const StyledToolbar = withTheme()(
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

const StyledLogoTitle = withTheme()(
  styled(LogoTitle)(({theme}) => ({
    pointerEvents: 'none',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }))
);

const Nav = styled.nav({
  display: 'flex',
  height: '100%',
  marginLeft: -8
});

const NavItem = compose(
  withTheme(),
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

const Action = withTheme()(
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

const StyledAvatar = styled(Avatar)({
  color: 'white',
  backgroundColor: TWITTER_BLUE
});

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

export default function Header() {
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
          <StyledLogoTitle />
          <NoSsr>
            <Action>
              <WithUser>
                {({user}) =>
                  user ? (
                    <UserMenu user={user} />
                  ) : (
                    <TwitterLogin>
                      {({pending, startAuth}) => (
                        <Tooltip title="Log in with Twitter">
                          <StyledAvatar
                            component={ButtonBase}
                            onClick={startAuth}
                            disabled={pending}
                          >
                            <FaTwitter size={20} />
                          </StyledAvatar>
                        </Tooltip>
                      )}
                    </TwitterLogin>
                  )
                }
              </WithUser>
            </Action>
          </NoSsr>
        </StyledPageWrapper>
      </StyledToolbar>
    </AppBar>
  );
}
