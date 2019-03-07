import AppBar from '@material-ui/core/AppBar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar'; // eslint-disable-line sort-imports-es6-autofix/sort-imports-es6
import NoSsr from 'react-no-ssr';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import TwitterLogin from './twitter-login';
import Typography from '@material-ui/core/Typography';
import UserMenu from './user-menu';
import compose from 'recompose/compose';
import logo from '../assets/logo.png';
import mapProps from 'recompose/mapProps';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
import withUser from './with-user';
import {FaTwitter} from 'react-icons/fa';
import {Link, StaticQuery, graphql} from 'gatsby';
import {TWITTER_BLUE} from '../utils/constants';
import {withTheme} from '@material-ui/core/styles';

const Logo = styled.div({
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
});

const StyledImage = styled.img({
  width: 48,
  marginRight: 8
});

const Nav = styled.nav({
  display: 'flex',
  alignSelf: 'stretch'
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
      margin: `0 ${8}px`,
      padding: `0 ${8}px`,
      borderBottom: '2px solid transparent',
      textDecoration: 'none',
      '&.active': {
        color: main,
        borderColor: main
      }
    };
  })
);

const NavLink = withProps({
  activeClassName: 'active'
})(Link);

const PartialNavLink = mapProps(({className, ...props}) => ({
  ...props,
  getProps: ({isPartiallyCurrent}) =>
    isPartiallyCurrent
      ? {className: [className, 'active'].join(' ')}
      : {className}
}))(Link);

const RightActions = styled.div({
  display: 'flex',
  marginLeft: 'auto'
});

const StyledAvatar = styled(Avatar)({
  color: 'white',
  backgroundColor: TWITTER_BLUE
});

function Header(props) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar>
        <Nav>
          <NavItem component={NavLink} to="/">
            Home
          </NavItem>
          <NavItem component={PartialNavLink} to="/csgo">
            CS:GO
          </NavItem>
          <NavItem color="textSecondary">DOTA 2</NavItem>
        </Nav>
        <Logo>
          <StyledImage src={logo} />
          <StaticQuery
            query={graphql`
              {
                site {
                  siteMetadata {
                    title
                  }
                }
              }
            `}
            render={data => (
              <Typography variant="h6">
                {data.site.siteMetadata.title}
              </Typography>
            )}
          />
        </Logo>
        <RightActions>
          <NoSsr>
            {props.user ? (
              <UserMenu user={props.user} />
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
            )}
          </NoSsr>
          {props.children}
        </RightActions>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object
};

export default withUser(Header);
