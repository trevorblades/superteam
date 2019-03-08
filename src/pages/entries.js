import Header from '../components/header';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import NoSsr from '@material-ui/core/NoSsr';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import ViewTeamButton from '../components/view-team-button';
import formatDiff from '../utils/format-diff';
import withUser from '../components/with-user';
import {LIST_ENTRIES} from '../utils/queries';
import {Query} from 'react-apollo';
import {Section} from '../components/common';
import {parse} from 'querystring';

function Entries(props) {
  const {id} = parse(props.location.search.slice(1));
  return (
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex" />
        <title>My entries</title>
      </Helmet>
      <Header />
      <NoSsr>
        {props.user ? (
          <Section>
            <Typography variant="h3" gutterBottom>
              My entries
            </Typography>
            <Query query={LIST_ENTRIES}>
              {({data, loading, error}) => {
                if (loading) {
                  return <Typography>Loading</Typography>;
                } else if (error) {
                  return <Typography color="error">{error.message}</Typography>;
                }

                return (
                  <Table padding="none">
                    <TableHead>
                      <TableRow>
                        <TableCell>Team name</TableCell>
                        <TableCell align="right">Avg. rating</TableCell>
                        <TableCell align="right">Rating diff.</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.entries.map(entry => (
                        <TableRow key={entry.id} selected={entry.id === id}>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell align="right">
                            {entry.currentRating}
                          </TableCell>
                          <TableCell align="right">
                            {formatDiff(
                              entry.initialRating - entry.currentRating
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <ViewTeamButton />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              }}
            </Query>
          </Section>
        ) : (
          <Section>
            <Typography>No user plz login</Typography>
          </Section>
        )}
      </NoSsr>
    </Layout>
  );
}

Entries.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object.isRequired
};

export default withUser(Entries);
