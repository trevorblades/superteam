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
  getQuarterlyFinancials
} from '../utils/get-entry-financials';
import {graphql} from 'gatsby';

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
    const financials = getQuarterlyFinancials(superteam.entries, quarters);
    const entries = financials[this.state.quarter];

    const counts = entries.reduce(
      (acc, entry) => ({
        ...acc,
        [entry.diff]: acc[entry.diff] ? acc[entry.diff] + 1 : 1
      }),
      {}
    );

    const diffs = Object.keys(counts)
      .map(Number)
      .sort((a, b) => b - a);
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
            <FormControl margin="dense">
              <InputLabel htmlFor="quarter">Ranking period</InputLabel>
              <Select
                value={this.state.quarter}
                onChange={this.onQuarterChange}
                inputProps={{
                  id: 'quarter'
                }}
              >
                {quarters.map(quarter => {
                  const {label, start, end} = getQuarterDate(quarter);
                  return (
                    <MenuItem key={quarter} value={quarter}>
                      {label} ({format(start, 'LLL d')} -{' '}
                      {format(end, 'LLL d, yyyy')})
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
                {entries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {counts[entry.diff] > 1 ? 'T' : ''}
                      {diffs.indexOf(entry.diff) + 1}
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <FinancialCells
                      diff={entry.diff}
                      currentValue={entry.currentValue}
                      initialValue={entry.initialValue}
                    />
                  </TableRow>
                ))}
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
