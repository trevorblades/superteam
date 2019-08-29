import MenuButton from '../menu-button';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {IconButton, MenuItem, withTheme} from '@material-ui/core';
import {Link} from 'gatsby';
import {MdMenu} from 'react-icons/md';

const StyledButton = withTheme(
  styled(IconButton)(({theme}) => ({
    [theme.breakpoints.only('xs')]: {
      marginLeft: -8
    }
  }))
);

export default function MobileNav(props) {
  return (
    <MenuButton
      renderButton={openMenu => (
        <StyledButton onClick={openMenu}>
          <MdMenu />
        </StyledButton>
      )}
    >
      {props.items.map(item => (
        <MenuItem component={Link} to={item.path} key={item.path}>
          {item.title}
        </MenuItem>
      ))}
    </MenuButton>
  );
}

MobileNav.propTypes = {
  items: PropTypes.array.isRequired
};
