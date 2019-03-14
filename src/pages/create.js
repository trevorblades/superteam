import CheckoutButton from '../components/checkout-button';
import Header from '../components/header';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import React, {Fragment} from 'react';
import TeamBuilder from '../components/team-builder';
import TeamBuilderWrapper from '../components/team-builder-wrapper';

export default function Create() {
  return (
    <Layout>
      <Helmet>
        <title>Create a team</title>
      </Helmet>
      <TeamBuilderWrapper>
        {teamBuilderProps => (
          <Fragment>
            <Header>
              <CheckoutButton players={teamBuilderProps.selectedPlayers} />
            </Header>
            <TeamBuilder {...teamBuilderProps} />
          </Fragment>
        )}
      </TeamBuilderWrapper>
    </Layout>
  );
}
