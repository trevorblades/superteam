import AuthRequired from '../components/auth-required';
import Button from '@material-ui/core/Button';
import EntryDrawer from '../components/entry-drawer';
import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Footer from '../components/footer';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
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
import styled from '@emotion/styled';
import {LIST_ENTRIES} from '../utils/queries';
import {Link} from 'gatsby';
import {PageWrapper, Section} from '../components/common';
import {Query} from 'react-apollo';

const StyledPageWrapper = styled(PageWrapper)({
  padding: `${12}px 0`
});

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
            <PageWrapper centered>
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

                  return (
                    <Fragment>
                      <StyledPageWrapper mini>
                        <PrimaryEntryCard
                          entry={data.entries.find(entry => entry.primary)}
                        />
                      </StyledPageWrapper>
                      <br />
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
                              <FinancialCells {...getEntryFinancials(entry)} />
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
                        </TableBody>
                      </Table>
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
