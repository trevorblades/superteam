import Header from './header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {Global} from '@emotion/core';
import {StaticQuery, graphql} from 'gatsby';
import {cover} from 'polished';

const Container = styled.div(cover(), {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto'
});

export default function Layout(props) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
      `}
      render={data => {
        const {title, description} = data.site.siteMetadata;
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
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Inconsolata:400,700"
              />
            </Helmet>
            <Header />
            {props.children}
          </Container>
        );
      }}
    />
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
