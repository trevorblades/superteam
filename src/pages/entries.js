import Header from '../components/header';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Section} from '../components/common';

export default function Entries() {
  return (
    <Layout>
      <Header />
      <Section>
        <Typography variant="h2">My entries</Typography>
      </Section>
    </Layout>
  );
}
