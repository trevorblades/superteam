import Footer from '../components/footer';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Hero, PageWrapper} from '../components/common';
import {Link} from 'gatsby';

// TODO: provide links to actions, like "create a team" etc.
export default function NotFound() {
  return (
    <Layout>
      <Hero>
        <PageWrapper centered>
          <Typography variant="h2" gutterBottom>
            Page not found
          </Typography>
          <Typography variant="body1">
            Try starting over from <Link to="/">home</Link>.
          </Typography>
        </PageWrapper>
      </Hero>
      <Footer />
    </Layout>
  );
}
