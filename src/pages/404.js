import Header from '../components/header';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Hero} from '../components/common';

export default function NotFound() {
  return (
    <Layout>
      <Header />
      <Hero>
        <Typography variant="h1">Where am I?</Typography>
      </Hero>
    </Layout>
  );
}
