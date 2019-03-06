import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import TwitterLogin from './twitter-login';
import Typography from '@material-ui/core/Typography';
import compose from 'recompose/compose';
import logo from '../assets/logo.png';
import mapProps from 'recompose/mapProps';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
import {FaTwitter} from 'react-icons/fa';
import {Link, StaticQuery, graphql} from 'gatsby';
import {withTheme} from '@material-ui/core/styles';

const Logo = styled.div({
  display: 'flex',
  alignItems: 'center',
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

const NavItem = withProps({
  variant: 'subtitle1'
})(
  styled(Typography)({
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${8}px`,
    padding: `0 ${8}px`,
    borderBottom: '2px solid transparent',
    textDecoration: 'none'
  })
);

const NavLink = compose(
  withTheme(),
  mapProps(({theme, ...props}) => {
    const {main} = theme.palette.primary;
    return {
      ...props,
      component: Link,
      activeStyle: {
        color: main,
        borderColor: main
      }
    };
  })
)(NavItem);

const RightActions = styled.div({
  display: 'flex',
  marginLeft: 'auto'
});

const StyledAvatar = styled(Avatar)({
  color: 'white',
  backgroundColor: '#38a1f3'
});

export default function Header(props) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/csgo">CS:GO</NavLink>
          <NavItem color="textSecondary">DOTA 2</NavItem>
          <NavItem color="textSecondary">NBA</NavItem>
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
          {props.children}
        </RightActions>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  children: PropTypes.node
};
