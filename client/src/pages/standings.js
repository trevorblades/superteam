import FinancialCells, {
  FinancialCell,
  FinancialHeaders
} from '../components/financial-cells';
import Footer from '../components/footer';
import Helmet from 'react-helmet';
import LastUpdated from '../components/last-updated';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import StandingsExplainer from '../components/standings-explainer';
import WithUser from '../components/with-user';
import styled from '@emotion/styled';
import {FaStar} from 'react-icons/fa';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import {PageWrapper, Section} from '../components/common';
import {differenceInQuarters, format, getQuarter} from 'date-fns';
import {
  getQuarterDate,
  getQuarterlyFinancials,
  rankingCriteria
} from '../utils/get-entry-financials';
import {graphql} from 'gatsby';

const StyledTable = styled(Table)({
  margin: `${16}px 0`
});

function getCountKey(entry) {
  return rankingCriteria.map(criteria => entry[criteria]).toString();
}

const title = 'Standings';
const startDate = new Date('2019-01-01');
export default class Standings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quarter: getQuarter(Number(props.data.site.buildTime))
    };
  }

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  onQuarterChange = event => {
    this.setState({
      quarter: event.target.value
    });
  };

  renderStandings(quarters) {
    if (!quarters.length) {
      return (
        <Typography variant="h5" color="textSecondary">
          No active contests
        </Typography>
      );
    }

    const financials = getQuarterlyFinancials(
      this.props.data.superteam.entries,
      quarters,
      Number(this.props.data.site.buildTime)
    );

    const entries = financials[this.state.quarter];
    const counts = entries.reduce((acc, entry) => {
      const key = getCountKey(entry);
      return {
        ...acc,
        [key]: acc[key] ? acc[key] + 1 : 1
      };
    }, {});

    const countKeys = Object.keys(counts);
    return (
      <Fragment>
        <FormControl>
          <InputLabel htmlFor="quarter">Ranking period</InputLabel>
          <Select
            value={this.state.quarter}
            onChange={this.onQuarterChange}
            inputProps={{id: 'quarter'}}
          >
            {quarters.map(quarter => {
              const {label, start, end} = getQuarterDate(quarter);
              const startDate = format(start, 'LLL d');
              const endDate = format(end, 'LLL d, yyyy');
              return (
                <MenuItem key={quarter} value={quarter}>
                  {label} ({startDate} - {endDate})
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <WithUser>
          {({user}) => (
            <StyledTable padding="none">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell padding="default">Team name</TableCell>
                  <FinancialHeaders />
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map(entry => {
                  const key = getCountKey(entry);
                  const isUserEntry = user && user.id === Number(entry.userId);
                  const rank =
                    (counts[key] > 1 ? 'T' : '') + (countKeys.indexOf(key) + 1);
                  return (
                    <TableRow key={entry.id}>
                      <FinancialCell bold={isUserEntry}>{rank}</FinancialCell>
                      <FinancialCell padding="default" bold={isUserEntry}>
                        {isUserEntry && (
                          <Fragment>
                            <FaStar
                              style={{
                                verticalAlign: -2
                              }}
                            />{' '}
                          </Fragment>
                        )}
                        {entry.name}
                      </FinancialCell>
                      <FinancialCells
                        bold={isUserEntry}
                        diff={entry.diff}
                        currentValue={entry.currentValue}
                        currentCash={entry.currentCash}
                        initialValue={entry.initialValue}
                      />
                    </TableRow>
                  );
                })}
              </TableBody>
            </StyledTable>
          )}
        </WithUser>
        <Typography component="p" variant="caption" color="textSecondary">
          <LastUpdated />. <StandingsExplainer />?
        </Typography>
      </Fragment>
    );
  }

  render() {
    const numQuarters =
      differenceInQuarters(Number(this.props.data.site.buildTime), startDate) +
      1;

    const quarters = Array.from(Array(numQuarters).keys())
      .map(num => num + 1)
      .slice(1);

    return (
      <Layout>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Section>
          <PageWrapper>
            <Typography variant="h2" gutterBottom>
              {title}
            </Typography>
            {this.renderStandings(quarters)}
          </PageWrapper>
        </Section>
        <Footer />
      </Layout>
    );
  }
}

export const query = graphql`
  {
    site {
      buildTime(formatString: "x")
    }
    superteam {
      entries: standings {
        id
        name
        createdAt
        userId
        selections {
          id
          createdAt
          deletedAt
          player {
            statistics {
              rating
              kills
              week
              year
            }
          }
        }
      }
    }
  }
`;