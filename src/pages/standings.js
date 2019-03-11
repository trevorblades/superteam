import FinancialCells, {FinancialHeaders} from '../components/financial-cells';
import Header from '../components/header';
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
import {Section} from '../components/common';
import {graphql} from 'gatsby';

export default function Standings(props) {
  return (
    <Layout>
      <Helmet>
        <title>Standings</title>
      </Helmet>
      <Header />
      <Section>
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
            {props.data.superteam.entries.map((entry, index) => {
              const createdAt = new Date(Number(entry.createdAt));
              return (
                <TableRow key={entry.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <FinancialCells
                    createdAt={createdAt}
                    players={entry.players}
                  />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Section>
    </Layout>
  );
}

Standings.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    superteam {
      entries: standings {
        id
        name
        createdAt
        players {
          statistics {
            percentile
            week
            year
          }
        }
      }
    }
  }
`;
