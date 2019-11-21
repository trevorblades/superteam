import Footer from '../components/footer';
import Layout from '../components/layout';
import React from 'react';
import {Hero, PageWrapper} from '../components/common';
import {Typography} from '@material-ui/core';

// TODO: provide links to actions, like "create a team" etc.
export default function NotFound() {
  return (
    <Layout>
      <Hero>
        <PageWrapper>
          <Typography variant="h2" gutterBottom>
            404 Door stuck
          </Typography>
          <Typography>We couldn&apos;t find that page 😕</Typography>
        </PageWrapper>
      </Hero>
      <Footer />
    </Layout>
  );
}
