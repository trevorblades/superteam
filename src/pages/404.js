import Header from '../components/header';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Hero} from '../components/common';
import {Link} from 'gatsby';

export default function NotFound() {
  return (
    <Layout>
      <Header />
      <Hero>
        <Typography variant="h1">Darn...</Typography>
        <Typography variant="h2" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body1">
          Try starting over from <Link to="/">home</Link>.
        </Typography>
      </Hero>
    </Layout>
  );
}
