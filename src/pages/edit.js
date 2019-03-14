import Helmet from 'react-helmet';
import Layout from '../components/layout';
import LoadingIndicator from '../components/loading-indicator';
import NotFound from './404';
import PropTypes from 'prop-types';
import React from 'react';
import TeamBuilder from '../components/team-builder';
import getEntryFinancials from '../utils/get-entry-financials';
import {GET_ENTRY} from '../utils/queries';
import {Query} from 'react-apollo';

export default function Edit(props) {
  const match = props.location.pathname.match(/^\/edit\/(\d+)\/?$/);
  if (!match) {
    return <NotFound />;
  }

  return (
    <Query query={GET_ENTRY} variables={{id: match[1]}}>
      {({data, loading, error}) => {
        if (loading) {
          return <LoadingIndicator />;
        }

        if (error) {
          return <div>{error.message}</div>;
        }

        const {playerValue, totalValue} = getEntryFinancials(data.entry);
        return (
          <Layout>
            <Helmet>
              <title>{data.entry.name}</title>
            </Helmet>
            <TeamBuilder
              budget={totalValue}
              amountSpent={playerValue}
              selectedPlayers={data.entry.players.map(player => player.id)}
            />
          </Layout>
        );
      }}
    </Query>
  );
}

Edit.propTypes = {
  location: PropTypes.object.isRequired
};
