import Header from '../components/header';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import LoadingIndicator from '../components/loading-indicator';
import NotFound from './404';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import SaveButton from '../components/save-button';
import TeamBuilder from '../components/team-builder';
import TeamBuilderWrapper from '../components/team-builder-wrapper';
import getEntryFinancials from '../utils/get-entry-financials';
import {GET_ENTRY, UPDATE_ENTRY} from '../utils/queries';
import {Mutation, Query} from 'react-apollo';
import {navigate} from 'gatsby';

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
            <TeamBuilderWrapper
              amountSpent={playerValue}
              selectedPlayers={data.entry.players.map(player => player.id)}
            >
              {teamBuilderProps => (
                <Fragment>
                  <Header>
                    <Mutation
                      mutation={UPDATE_ENTRY}
                      variables={{
                        id: data.entry.id,
                        playerIds: teamBuilderProps.selectedPlayers.map(
                          player => player.id
                        )
                      }}
                      onCompleted={data =>
                        navigate(`/entries/${data.updateEntry.id}`)
                      }
                    >
                      {(updateEntry, {loading}) => (
                        <SaveButton
                          style={{marginLeft: 16}}
                          onClick={updateEntry}
                          disabled={loading}
                        />
                      )}
                    </Mutation>
                  </Header>
                  <TeamBuilder {...teamBuilderProps} budget={totalValue} />
                </Fragment>
              )}
            </TeamBuilderWrapper>
          </Layout>
        );
      }}
    </Query>
  );
}

Edit.propTypes = {
  location: PropTypes.object.isRequired
};
