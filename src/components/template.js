import Footer from './footer';
import Helmet from 'react-helmet';
import Layout from './layout';
import PropTypes from 'prop-types';
import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {PageWrapper, Section} from './common';
import {Typography} from '@material-ui/core';
import {withProps} from 'recompose';

const GutterBottom = withProps({
  gutterBottom: true
})(Typography);

const components = {
  h2: withProps({variant: 'h2'})(GutterBottom),
  h3: withProps({variant: 'h3'})(GutterBottom),
  h4: withProps({variant: 'h4'})(GutterBottom),
  h5: withProps({variant: 'h5'})(GutterBottom),
  h6: withProps({variant: 'h6'})(GutterBottom),
  li: withProps({component: 'li'})(GutterBottom),
  p: withProps({paragraph: true})(Typography)
};

export default function Template(props) {
  return (
    <Layout>
      <Helmet>
        <title>{props.pageContext.frontmatter.title}</title>
      </Helmet>
      <Section>
        <PageWrapper mini>
          <MDXProvider components={components}>{props.children}</MDXProvider>
        </PageWrapper>
      </Section>
      <Footer />
    </Layout>
  );
}

Template.propTypes = {
  children: PropTypes.node.isRequired,
  pageContext: PropTypes.object.isRequired
};
