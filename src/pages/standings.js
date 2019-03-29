import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Footer from '../components/footer';
import FormControl from '@material-ui/core/FormControl';
import Helmet from 'react-helmet';
import InputLabel from '@material-ui/core/InputLabel';
import Layout from '../components/layout';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import differenceInQuarters from 'date-fns/differenceInQuarters';
import format from 'date-fns/format';
import getQuarter from 'date-fns/getQuarter';
import {PageWrapper, Section} from '../components/common';
import {
  getQuarterDate,
  getQuarterlyFinancials,
  rankingCriteria
} from '../utils/get-entry-financials';
import {graphql} from 'gatsby';

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

  render() {
    const {site, superteam} = this.props.data;
    const {lastUpdated} = site.siteMetadata;
    const numQuarters = differenceInQuarters(lastUpdated, startDate) + 1;
    const quarters = Array.from(Array(numQuarters).keys()).map(num => num + 1);
    const financials = getQuarterlyFinancials(
      superteam.entries,
      quarters,
      lastUpdated
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
      <Layout>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Section>
          <PageWrapper centered>
            <Typography variant="h3" gutterBottom>
              {title}
            </Typography>
            <FormControl margin="normal">
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
            <Table padding="none">
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
            </Table>
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
