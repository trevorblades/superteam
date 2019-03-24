import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Footer from '../components/footer';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import getEntryFinancials from '../utils/get-entry-financials';
import {PageWrapper, Section} from '../components/common';
import {graphql} from 'gatsby';

export default function Standings(props) {
  const entries = props.data.superteam.entries
    .map(entry => ({
      ...entry,
      ...getEntryFinancials(entry)
    }))
    .sort((a, b) => b.diff - a.diff);

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
        <PageWrapper>
          <Typography variant="h3" gutterBottom>
            Standings
          </Typography>
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
