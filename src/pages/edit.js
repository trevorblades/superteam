import AuthRequired from '../components/auth-required';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import LoadingIndicator from '../components/loading-indicator';
import NoIndex from '../components/no-index';
import NoSsr from '@material-ui/core/NoSsr';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import SaveButton from '../components/save-button';
import TeamBuilder from '../components/team-builder';
import Typography from '@material-ui/core/Typography';
import getEntryFinancials from '../utils/get-entry-financials';
import styled from '@emotion/styled';
import {GET_ENTRY, UPDATE_ENTRY} from '../utils/queries';
import {Mutation, Query} from 'react-apollo';
import {Section} from '../components/common';
import {TEAM_SIZE} from '../utils/constants';
import {navigate} from 'gatsby';

const StyledLoadingIndicator = styled(LoadingIndicator)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
});

export default function Edit(props) {
  // we don't need to make sure this is truthy because...
  // we're redirecting /edit to /create in static/_redirects
  const match = props.location.pathname.match(/^\/edit\/(\S+)\/?$/);
  return (
    <Layout>
      <NoIndex />
      <NoSsr>
        <AuthRequired>
          {match && (
            <Query query={GET_ENTRY} variables={{id: match[1]}}>
              {({data, loading, error}) => {
                if (loading) {
                  return <StyledLoadingIndicator />;
                }

                if (error) {
                  return (
                    <Section>
                      <Typography variant="h2" gutterBottom>
                        Error
                      </Typography>
                      <Typography variant="body1">{error.message}</Typography>
                    </Section>
                  );
                }

                const {players, playerValue, totalValue} = getEntryFinancials(
                  data.entry
                );
                return (
                  <Fragment>
                    <Helmet>
                      <title>{data.entry.name}</title>
                    </Helmet>
                    <TeamBuilder
                      amountSpent={playerValue}
                      selectedPlayers={players.map(player => player.id)}
                      budget={totalValue}
                      action={players => (
                        <Mutation
                          mutation={UPDATE_ENTRY}
                          variables={{
                            id: data.entry.id,
                            playerIds: players.map(player => player.id)
                          }}
                          onCompleted={data =>
                            navigate(`/teams/${data.updateEntry.id}`)
                          }
                        >
                          {(updateEntry, {loading}) => (
                            <SaveButton
                              style={{marginLeft: 16}}
                              onClick={updateEntry}
                              disabled={loading || players.length < TEAM_SIZE}
                            />
                          )}
                        </Mutation>
                      )}
                    />
                  </Fragment>
                );
              }}
            </Query>
          )}
        </AuthRequired>
      </NoSsr>
    </Layout>
  );
}

Edit.propTypes = {
  location: PropTypes.object.isRequired
};
