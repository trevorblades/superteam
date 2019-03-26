import AuthRequired from '../components/auth-required';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import EntryDrawer from '../components/entry-drawer';
import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import LoadingIndicator from '../components/loading-indicator';
import NoIndex from '../components/no-index';
import NoSsr from '@material-ui/core/NoSsr';
import PrimaryCheckbox from '../components/primary-checkbox';
import PropTypes from 'prop-types';
import React from 'react';
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
import {MdStar} from 'react-icons/md';
import {PageWrapper, Section} from '../components/common';
import {Query} from 'react-apollo';
import {withTheme} from '@material-ui/core/styles';

const StyledStar = withTheme()(
  styled(MdStar)(({theme}) => ({
    display: 'block',
    fill: theme.palette.primary.main
  }))
);

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

                  const primary = data.entries.find(entry => entry.primary);
                  return (
                    <Grid container spacing={24}>
                      <Grid item md={8} xs={12}>
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
                                    value={entry.id}
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
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid item md={4} sm={8} xs={12}>
                        <Card>
                          <CardHeader
                            avatar={<StyledStar size={36} />}
                            title={primary.name}
                            titleTypographyProps={{
                              variant: 'h6'
                            }}
                            subheader="Primary team"
                          />
                          <CardContent>
                            <Typography>Test</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
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
