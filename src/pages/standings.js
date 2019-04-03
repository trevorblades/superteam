import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Footer from '../components/footer';
import FormControl from '@material-ui/core/FormControl';
import Helmet from 'react-helmet';
import InputLabel from '@material-ui/core/InputLabel';
import LastUpdated from '../components/last-updated';
import Layout from '../components/layout';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Select from '@material-ui/core/Select';
import StandingsExplainer from '../components/standings-explainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import differenceInQuarters from 'date-fns/differenceInQuarters';
import format from 'date-fns/format';
import getQuarter from 'date-fns/getQuarter';
import styled from '@emotion/styled';
import {PageWrapper, Section} from '../components/common';
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
      quarter: getQuarter(props.data.site.siteMetadata.lastUpdated)
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
      this.props.data.site.siteMetadata.lastUpdated
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
        <StyledTable padding="none">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Team name</TableCell>
              <FinancialHeaders />
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(entry => {
              const key = getCountKey(entry);
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    {counts[key] > 1 ? 'T' : ''}
                    {countKeys.indexOf(key) + 1}
                  </TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <FinancialCells
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
        <Typography component="p" variant="caption" color="textSecondary">
          <LastUpdated />. <StandingsExplainer />?
        </Typography>
      </Fragment>
    );
  }

  render() {
    const numQuarters =
      differenceInQuarters(
        this.props.data.site.siteMetadata.lastUpdated,
        startDate
      ) + 1;

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
            <Typography variant="h3" gutterBottom>
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
      siteMetadata {
        lastUpdated
      }
    }
    superteam {
      entries: standings {
        id
        name
        createdAt
        selections {
          id
          createdAt
          deletedAt
          player {
            statistics {
              kills
              percentile
              week
              year
            }
          }
        }
      }
    }
  }
`;
