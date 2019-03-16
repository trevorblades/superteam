import AuthRequired from '../components/auth-required';
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
  const match = props.location.pathname.match(/^\/edit\/(\d+)\/?$/);
  if (!match) {
    return <NotFound />;
  }

  return (
    <Layout>
      <AuthRequired>
        <Query query={GET_ENTRY} variables={{id: match[1]}}>
          {({data, loading, error}) => {
            if (loading) {
              return <StyledLoadingIndicator />;
            }

            if (error) {
              return (
                <Fragment>
                  <Header />
                  <Section>
                    <Typography variant="h2" gutterBottom>
                      Error
                    </Typography>
                    <Typography variant="body1">{error.message}</Typography>
                  </Section>
                </Fragment>
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
                <TeamBuilderWrapper
                  amountSpent={playerValue}
                  selectedPlayers={players.map(player => player.id)}
                >
                  {teamBuilderProps => {
                    const {selectedPlayers} = teamBuilderProps;
                    return (
                      <Fragment>
                        <Header>
                          <Mutation
                            mutation={UPDATE_ENTRY}
                            variables={{
                              id: data.entry.id,
                              playerIds: selectedPlayers.map(
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
                                disabled={
                                  loading || selectedPlayers.length < TEAM_SIZE
                                }
                              />
                            )}
                          </Mutation>
                        </Header>
                        <TeamBuilder
                          {...teamBuilderProps}
                          budget={totalValue}
                        />
                      </Fragment>
                    );
                  }}
                </TeamBuilderWrapper>
              </Fragment>
            );
          }}
        </Query>
      </AuthRequired>
    </Layout>
  );
}

Edit.propTypes = {
  location: PropTypes.object.isRequired
};
