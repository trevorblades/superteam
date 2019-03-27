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
import endOfQuarter from 'date-fns/endOfQuarter';
import getEntryFinancials from '../utils/get-entry-financials';
import setQuarter from 'date-fns/setQuarter';
import setYear from 'date-fns/setYear';
import {PageWrapper, Section} from '../components/common';
import {graphql} from 'gatsby';

const now = Date.now();
export default class Standings extends Component {
  state = {
    quarter: 2
  };

  onQuarterChange = event => {
    this.setState({
      quarter: event.target.value
    });
  };

  render() {
    const year = 2018 + Math.ceil(this.state.quarter / 4);
    const quarter = this.state.quarter % 4 || 4;
    const entries = this.props.data.superteam.entries
      .filter(entry => {
        const date = endOfQuarter(setQuarter(setYear(now, year), quarter));
        return Number(entry.createdAt) <= date.getTime();
      })
      .map(entry => ({
        ...entry,
        ...getEntryFinancials(entry, this.state.quarter)
      }))
      .sort((a, b) => b.diff - a.diff);

    console.log(entries);

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
          <title>Standings</title>
        </Helmet>
        <Section>
          <PageWrapper centered>
            <Typography variant="h3">Standings</Typography>
            <FormControl margin="normal">
              <InputLabel htmlFor="quarter">Quarter</InputLabel>
              <Select
                value={this.state.quarter}
                onChange={this.onQuarterChange}
                inputProps={{id: 'quarter'}}
              >
                <MenuItem value={1}>Q1 2019</MenuItem>
                <MenuItem value={2}>Q2 2019</MenuItem>
              </Select>
            </FormControl>
            <Table padding="none">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Team name</TableCell>
                  <FinancialHeaders hideCash />
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
                      playerValue={entry.playerValue}
                      totalValue={entry.totalValue}
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

Standings.propTypes = {
  data: PropTypes.object.isRequired
};

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
            id
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
