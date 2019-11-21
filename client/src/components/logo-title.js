import PropTypes from 'prop-types';
import React from 'react';
import logo from '../assets/logo.png';
import {Box} from '@material-ui/core';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {LogoTitleProps} from '@trevorblades/mui-theme';
import {graphql, useStaticQuery} from 'gatsby';

export default function LogoTitle(props) {
  const data = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  const {title} = data.site.siteMetadata;
  return (
    <Box {...LogoTitleProps.root} className={props.className}>
      {props.vector ? (
        <Box component={Logo} {...LogoTitleProps.logo} fill="currentColor" />
      ) : (
        <Box component="img" {...LogoTitleProps.logo} alt={title} src={logo} />
      )}
      <Box {...LogoTitleProps.title}>{title}</Box>
    </Box>
  );
}

LogoTitle.propTypes = {
  vector: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string
};
