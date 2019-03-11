import AuthRequired from '../components/auth-required';
import Button from '@material-ui/core/Button';
import Diff from '../components/diff';
import EntryDrawer from '../components/entry-drawer';
import Header from '../components/header';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import LoadingIndicator from '../components/loading-indicator';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import getISOWeek from 'date-fns/getISOWeek';
import getISOWeekYear from 'date-fns/getISOWeekYear';
import getPlayerCost, {getInitialPlayerCost} from '../utils/get-player-cost';
import sum from '../utils/sum';
import {LIST_ENTRIES} from '../utils/queries';
import {Link} from 'gatsby';
import {Query} from 'react-apollo';
import {Section} from '../components/common';
import {TOTAL_BUDGET} from '../utils/constants';

export default function Entries(props) {
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
                return <LoadingIndicator />;
              } else if (error) {
                return <Typography color="error">{error.message}</Typography>;
              }

              return (
                <Fragment>
                  <Table padding="none">
                    <TableHead>
                      <TableRow>
                        <TableCell>Team name</TableCell>
                        <TableCell align="right">Total value</TableCell>
                        <TableCell align="right">Gain/loss</TableCell>
                        <TableCell align="right">Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.entries.map(entry => {
                        const date = new Date(Number(entry.createdAt));
                        const week = getISOWeek(date);
                        const year = getISOWeekYear(date);
                        const initialValue = entry.players
                          .map(getInitialPlayerCost.bind(this, week, year))
                          .reduce(sum);

                        const initialRemainder = TOTAL_BUDGET - initialValue;
                        const currentValue = entry.players
                          .map(getPlayerCost)
                          .reduce(sum);
                        const adjustedValue = currentValue + initialRemainder;
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell align="right">
                              ${adjustedValue.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              <Diff value={currentValue - initialValue} />
                            </TableCell>
                            <TableCell align="right">
                              {date.toLocaleDateString()}
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </Fragment>
              );
            }}
          </Query>
          <EntryDrawer
            match={props.location.pathname.match(/^\/entries\/(\d+)\/?$/)}
          />
        </Section>
      </AuthRequired>
    </Layout>
  );
}

Entries.propTypes = {
  location: PropTypes.object.isRequired
};
