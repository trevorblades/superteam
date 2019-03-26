import AuthRequired from '../components/auth-required';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
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
import PlayerCard from '../components/player-card';
import PrimaryCheckbox from '../components/primary-checkbox';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import getEntryFinancials, {
  getEntryPlayers
} from '../utils/get-entry-financials';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
import {EmptyPlayerCard, PageWrapper, Section} from '../components/common';
import {FaStar} from 'react-icons/fa';
import {LIST_ENTRIES} from '../utils/queries';
import {Link} from 'gatsby';
import {MdShowChart} from 'react-icons/md';
import {Query} from 'react-apollo';
import {withTheme} from '@material-ui/core/styles';

const StyledPageWrapper = styled(PageWrapper)({
  padding: `${8}px 0`
});

const StyledStar = withTheme()(
  styled(FaStar)(({theme}) => ({
    display: 'block',
    fill: theme.palette.primary.main
  }))
);

const PlayerGridItem = withProps({
  item: true,
  md: 2,
  sm: 3,
  xs: 4
})(Grid);

const EmptyCardWrapper = styled(ButtonBase)({
  width: '100%',
  height: '100%'
});

const StyledEmptyPlayerCard = styled(EmptyPlayerCard)({
  width: '100%',
  height: '100%'
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

                  const primary = data.entries.find(entry => entry.primary);
                  return (
                    <Fragment>
                      <StyledPageWrapper mini>
                        <Card elevation={20}>
                          <CardHeader
                            avatar={<StyledStar size={32} />}
                            title={primary.name}
                            titleTypographyProps={{
                              variant: 'h6'
                            }}
                            subheader="Primary team"
                          />
                          <CardContent>
                            <Grid container spacing={16}>
                              {getEntryPlayers(primary).map(player => (
                                <PlayerGridItem key={player.id}>
                                  <PlayerCard
                                    mini
                                    static
                                    selected
                                    player={player}
                                  />
                                </PlayerGridItem>
                              ))}
                              <PlayerGridItem>
                                <EmptyCardWrapper
                                  component={Link}
                                  to={`/teams/${primary.id}`}
                                >
                                  <StyledEmptyPlayerCard>
                                    <MdShowChart size={32} />
                                    <Typography
                                      variant="overline"
                                      color="inherit"
                                      style={{marginBottom: -8}}
                                    >
                                      Details
                                    </Typography>
                                  </StyledEmptyPlayerCard>
                                </EmptyCardWrapper>
                              </PlayerGridItem>
                            </Grid>
                          </CardContent>
                        </Card>
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
