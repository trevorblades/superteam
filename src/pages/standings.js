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
import {PageWrapper, Section} from '../components/common';
import {
  getQuarterYear,
  getQuarterlyFinancials,
  normalizeQuarter
} from '../utils/get-entry-financials';
import {graphql} from 'gatsby';

const title = 'Standings';
const startDate = new Date('2019-01-01');
const numQuarters = differenceInQuarters(Date.now(), startDate) + 1;
const quarters = Array.from(Array(numQuarters).keys()).map(num => num + 1);
export default class Standings extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  state = {
    quarter: quarters[0]
  };

  onQuarterChange = event => {
    this.setState({
      quarter: event.target.value
    });
  };

  render() {
    const entries = getQuarterlyFinancials(
      this.props.data.superteam.entries,
      quarters
    )[this.state.quarter];

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
            <Typography variant="h3">{title}</Typography>
            <FormControl margin="normal">
              <InputLabel htmlFor="quarter">Quarter</InputLabel>
              <Select
                value={this.state.quarter}
                onChange={this.onQuarterChange}
                inputProps={{
                  id: 'quarter'
                }}
              >
                {quarters.map(quarter => (
                  <MenuItem key={quarter} value={quarter}>
                    Q{normalizeQuarter(quarter)} {getQuarterYear(quarter)}
                  </MenuItem>
                ))}
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
