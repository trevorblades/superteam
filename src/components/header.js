import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import compose from 'recompose/compose';
import logo from '../assets/logo.png';
import mapProps from 'recompose/mapProps';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
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
        {props.children}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  children: PropTypes.node
};
