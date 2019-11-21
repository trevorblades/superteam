import Header from './header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import socialCard from '../assets/images/social-card.png';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';
import {cover} from 'polished';
import {graphql, useStaticQuery} from 'gatsby';
import {resolve} from 'url';

const Container = styled.div(cover(), {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch'
});

export default function Layout(props) {
  const data = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  );

  const {title, description} = data.site.siteMetadata;
  const socialCardUrl = resolve('https://superteam.gg', socialCard);
  return (
    <Container>
      <Global
        styles={{
          'p > a': {
            color: 'inherit'
          }
        }}
      />
      <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`}>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialCardUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@superteamgg" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialCardUrl} />
      </Helmet>
      <Header />
      {props.children}
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
