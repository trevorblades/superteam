import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import logo from '../assets/logo.png';
import styled from '@emotion/styled';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {StaticQuery, graphql} from 'gatsby';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  paddingRight: 8
});

const logoStyles = {
  width: 48,
  marginRight: 8
};

const StyledImage = styled.img(logoStyles);
const StyledLogo = styled(Logo)(logoStyles, {
  fill: 'currentColor',
  stroke: 'currentColor'
});

export default function LogoTitle(props) {
  return (
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
      render={data => {
        const {title} = data.site.siteMetadata;
        return (
          <Container className={props.className}>
            {props.vector ? (
              <StyledLogo />
            ) : (
              <StyledImage alt={title} src={logo} />
            )}
            <Typography variant="h6" color={props.color}>
              {title}
            </Typography>
          </Container>
        );
      }}
    />
  );
}

LogoTitle.propTypes = {
  vector: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string
};
