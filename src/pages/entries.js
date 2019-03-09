import AuthRequired from '../components/auth-required';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Header from '../components/header';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import formatDiff from '../utils/format-diff';
import {GET_ENTRY, LIST_ENTRIES} from '../utils/queries';
import {Link, navigate} from 'gatsby';
import {Query} from 'react-apollo';
import {Section} from '../components/common';

function Entries(props) {
  const match = props.location.pathname.match(/^\/entries\/(\d+)\/?$/);
  return (
    <Layout>
      <Header />
      <AuthRequired>
        <Section>
          <Helmet>
            <title>My entries</title>
          </Helmet>
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
                <Fragment>
                  <Table padding="none">
                    <TableHead>
                      <TableRow>
                        <TableCell>Team name</TableCell>
                        <TableCell align="right">Rating</TableCell>
                        <TableCell align="right">Gain/loss</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.entries.map(entry => (
                        <TableRow key={entry.id}>
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
                            <Button
                              component={Link}
                              variant="outlined"
                              size="small"
                              to={`/entries/${entry.id}`}
                            >
                              View team
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Fragment>
              );
            }}
          </Query>
          <Drawer
            anchor="right"
            open={Boolean(match)}
            onClose={() => navigate('/entries')}
          >
            <Query
              query={GET_ENTRY}
              variables={{
                id: 1
              }}
            >
              {({data, loading, error}) => {
                if (loading) {
                  return <Typography>Loading</Typography>;
                } else if (error) {
                  return <Typography color="error">{error.message}</Typography>;
                }

                return <Typography>{data.entry.name}</Typography>;
              }}
            </Query>
          </Drawer>
        </Section>
      </AuthRequired>
    </Layout>
  );
}

Entries.propTypes = {
  location: PropTypes.object.isRequired
};
