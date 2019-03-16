import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
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
            <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`}>
              <meta name="description" content={description} />
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Inconsolata:400,700"
              />
              <link
                rel="icon"
                href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/earth-globe-americas_1f30e.png"
              />
            </Helmet>
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
