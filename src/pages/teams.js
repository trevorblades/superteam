import AuthRequired from '../components/auth-required';
import Button from '@material-ui/core/Button';
import EntryDrawer from '../components/entry-drawer';
import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import LinearProgress from '@material-ui/core/LinearProgress';
import LoadingIndicator from '../components/loading-indicator';
import NoIndex from '../components/no-index';
import NoSsr from '@material-ui/core/NoSsr';
import PrimaryCheckbox from '../components/primary-checkbox';
import PrimaryEntryCard from '../components/primary-entry-card';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import getEntryFinancials from '../utils/get-entry-financials';
import {LIST_ENTRIES} from '../utils/queries';
import {Link} from 'gatsby';
import {PageWrapper, Section} from '../components/common';
import {Query} from 'react-apollo';

const title = 'My teams';
export default function Teams(props) {
  return (
    <Layout>
      <NoIndex />
      <NoSsr>
        <AuthRequired>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Section>
            <PageWrapper>
              <Typography variant="h3" gutterBottom>
                {title}
              </Typography>
              <Query query={LIST_ENTRIES}>
                {({data, loading, error}) => {
                  if (loading) {
                    return <LoadingIndicator />;
                  } else if (error) {
                    return (
                      <Typography color="error">{error.message}</Typography>
                    );
                  }

                  if (!data.entries.length) {
                    return (
                      <Typography variant="h5" color="textSecondary">
                        No teams yet! Click <Link to="/create">here</Link> to
                        get started 🚀
                      </Typography>
                    );
                  }

                  const teamsUsed = data.entries.length / data.entriesLimit;
                  const hasTeamSlots = teamsUsed < 1;
                  return (
                    <Fragment>
                      <br />
                      <Grid container spacing={32}>
                        <Grid item xs={12} sm={11} md={9} lg={8}>
                          <PrimaryEntryCard
                            entry={data.entries.find(entry => entry.primary)}
                          />
                        </Grid>
                        <Grid item xs={12} md={3} lg={4}>
                          <Typography gutterBottom variant="h6">
                            {data.entries.length}/{data.entriesLimit} team slots used
                          </Typography>
                          <LinearProgress
                            value={Math.round(teamsUsed * 100)}
                            color={hasTeamSlots ? 'primary' : 'secondary'}
                            variant="determinate"
                          />
                          <br />
                          <Typography paragraph color="textSecondary">
                            Coming soon: Unlock additional slots
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Table padding="none">
                            <TableHead>
                              <TableRow>
                                <TableCell>Team name</TableCell>
                                <FinancialHeaders />
                                <TableCell align="right">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data.entries.map(entry => (
                                <TableRow key={entry.id}>
                                  <TableCell>
                                    <PrimaryCheckbox
                                      id={entry.id}
                                      name={entry.name}
                                      checked={entry.primary}
                                    />
                                    {entry.name}
                                  </TableCell>
                                  <FinancialCells
                                    {...getEntryFinancials(entry)}
                                  />
                                  <TableCell align="right">
                                    <Button
                                      component={Link}
                                      variant="outlined"
                                      size="small"
                                      to={`/teams/${entry.id}`}
                                    >
                                      Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {hasTeamSlots && (
                                <TableRow>
                                  <TableCell align="center" colSpan={7}>
                                    <Button
                                      size="small"
                                      component={Link}
                                      to="/create"
                                    >
                                      Create new team
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Grid>
                      </Grid>
                    </Fragment>
                  );
                }}
              </Query>
            </PageWrapper>
          </Section>
          <Footer />
          <EntryDrawer
            match={props.location.pathname.match(/^\/teams\/(\S+)\/?$/)}
          />
        </AuthRequired>
      </NoSsr>
    </Layout>
  );
}

Teams.propTypes = {
  location: PropTypes.object.isRequired
};
