import AuthRequired from '../components/auth-required';
import Button from '@material-ui/core/Button';
import EntryDrawer from '../components/entry-drawer';
import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Helmet from 'react-helmet';
import IconButton from '@material-ui/core/IconButton';
import Layout from '../components/layout';
import LinearProgress from '@material-ui/core/LinearProgress';
import LoadingIndicator from '../components/loading-indicator';
import NoIndex from '../components/no-index';
import NoSsr from '@material-ui/core/NoSsr';
import PrimaryCheckbox from '../components/primary-checkbox';
import PrimaryEntryCard from '../components/primary-entry-card';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TwitterLogin from '../components/twitter-login';
import Typography from '@material-ui/core/Typography';
import getEntryFinancials from '../utils/get-entry-financials';
import styled from '@emotion/styled';
import {Follow} from 'react-twitter-widgets';
import {LIST_ENTRIES} from '../utils/queries';
import {Link} from 'gatsby';
import {MdArrowForward, MdShare, MdVerifiedUser} from 'react-icons/md';
import {PageWrapper, Section} from '../components/common';
import {Query} from 'react-apollo';

const StyledStepper = styled(Stepper)({
  padding: 0,
  backgroundColor: 'transparent'
});

const FollowWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.twitter-follow-button': {
    display: 'block',
    marginRight: 8
  }
});

const StyledIconButton = styled(IconButton)({
  padding: 8
});

const title = 'My teams';
export default function Teams(props) {
  return (
    <Layout>
      <NoIndex />
      <NoSsr>
        <AuthRequired>
          {user => (
            <Fragment>
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
                            No teams yet! Click <Link to="/create">here</Link>{' '}
                            to get started 🚀
                          </Typography>
                        );
                      }

                      let activeStep = 0;
                      if (user.following) {
                        activeStep++;
                        if (user.tweeted) {
                          activeStep++;
                        }
                      }

                      const hasOpenSlots =
                        data.entries.length < user.entryLimit;
                      return (
                        <Fragment>
                          <br />
                          <Grid container spacing={32}>
                            <Grid item xs={12} sm={11} md={9} lg={8}>
                              <PrimaryEntryCard
                                entry={data.entries.find(
                                  entry => entry.primary
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={3} lg={4}>
                              <Typography gutterBottom variant="h6">
                                {data.entries.length}/{user.entryLimit} team
                                slots used
                              </Typography>
                              <LinearProgress
                                value={Math.round(
                                  (data.entries.length / user.entryLimit) * 100
                                )}
                                color={hasOpenSlots ? 'primary' : 'secondary'}
                                variant="determinate"
                              />
                              <br />
                              <Typography paragraph color="textSecondary">
                                {activeStep > 1
                                  ? 'All slots unlocked'
                                  : 'Unlock additional team slots'}
                              </Typography>
                              <StyledStepper
                                activeStep={activeStep}
                                orientation="vertical"
                              >
                                <Step>
                                  <StepLabel>Follow us on Twitter</StepLabel>
                                  <StepContent>
                                    <Typography
                                      gutterBottom
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      Click the follow button and then hit the
                                      verify button once you&apos;re following
                                      our account.
                                    </Typography>
                                    <FollowWrapper>
                                      <Follow
                                        username="superteamgg"
                                        options={{
                                          showScreenName: false,
                                          showCount: false,
                                          size: 'large'
                                        }}
                                      />
                                      <MdArrowForward size={20} />
                                      <TwitterLogin>
                                        {props => (
                                          <Tooltip title="Verify follow">
                                            <StyledIconButton {...props}>
                                              <MdVerifiedUser size={24} />
                                            </StyledIconButton>
                                          </Tooltip>
                                        )}
                                      </TwitterLogin>
                                    </FollowWrapper>
                                  </StepContent>
                                </Step>
                                <Step>
                                  <StepLabel>Share your team</StepLabel>
                                  <StepContent>
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      Tweet about your team using the
                                      #MySuperteam hashtag and superteam.gg URL.
                                      Click on the{' '}
                                      <MdShare
                                        style={{
                                          verticalAlign: -2
                                        }}
                                      />{' '}
                                      icon on the top right corner of your
                                      primary team card!
                                    </Typography>
                                  </StepContent>
                                </Step>
                              </StyledStepper>
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
                                  {hasOpenSlots && (
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
            </Fragment>
          )}
        </AuthRequired>
      </NoSsr>
    </Layout>
  );
}

Teams.propTypes = {
  location: PropTypes.object.isRequired
};
