import Helmet from 'react-helmet';
import Layout from '../components/layout';
import React from 'react';
import TeamBuilder from '../components/team-builder';

export default function Create() {
  return (
    <Layout>
      <Helmet>
        <title>Create a team</title>
      </Helmet>
      <TeamBuilder />
    </Layout>
  );
}
