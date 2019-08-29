import Footer from '../components/footer';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import Markdown from 'markdown-to-jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {PageWrapper, Section} from '../components/common';
import {graphql} from 'gatsby';
import {withTheme} from '@material-ui/core/styles';

const StyledListItem = withTheme(
  styled.li(({theme}) => ({
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary
  }))
);

function getHeadingOverride(variant) {
  return {
    component: Typography,
    props: {
      variant,
      gutterBottom: true
    }
  };
}

export default function Template(props) {
  const {frontmatter, rawMarkdownBody} = props.data.markdownRemark;
  return (
    <Layout>
      <Helmet>
        <title>{frontmatter.title}</title>
      </Helmet>
      <Section>
        <PageWrapper mini>
          <Markdown
            options={{
              overrides: {
                h2: getHeadingOverride('h2'),
                h3: getHeadingOverride('h3'),
                h4: getHeadingOverride('h4'),
                h5: getHeadingOverride('h5'),
                h6: getHeadingOverride('h6'),
                li: StyledListItem,
                p: {
                  component: Typography,
                  props: {
                    variant: 'body1',
                    paragraph: true
                  }
                }
              }
            }}
          >
            {rawMarkdownBody}
          </Markdown>
        </PageWrapper>
      </Section>
      <Footer />
    </Layout>
  );
}

Template.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      rawMarkdownBody
      frontmatter {
        title
      }
    }
  }
`;
