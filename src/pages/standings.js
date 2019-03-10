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
// import formatDiff from '../utils/format-diff';
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
              {/* <TableCell align="right">Avg. rating</TableCell>
              <TableCell align="right">Rating diff.</TableCell> */}
              <TableCell align="right">Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.superteam.entries.map((entry, index) => {
              const date = new Date(Number(entry.createdAt));
              return (
                <TableRow key={entry.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  {/* <TableCell align="right">{entry.currentRating}</TableCell>
                  <TableCell align="right">
                    {formatDiff(entry.initialRating - entry.currentRating)}
                  </TableCell> */}
                  <TableCell align="right">
                    {date.toLocaleDateString()}
                  </TableCell>
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
      }
    }
  }
`;
