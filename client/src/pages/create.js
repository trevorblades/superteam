import CheckoutButton from '../components/checkout-button';
import Helmet from 'react-helmet';
import HelpButton from '../components/help-button';
import Layout from '../components/layout';
import React, {Fragment} from 'react';
import TeamBuilder from '../components/team-builder';

export default function Create() {
  return (
    <Layout>
      <Helmet>
        <title>Create a team</title>
      </Helmet>
      <TeamBuilder>
        {players => (
          <Fragment>
            <HelpButton />
            <CheckoutButton players={players} />
          </Fragment>
        )}
      </TeamBuilder>
    </Layout>
  );
}
