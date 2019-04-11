import Diff from '../components/diff';
import Footer from '../components/footer';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {PageWrapper, Section} from '../components/common';
import {graphql} from 'gatsby';
import {ratingToCost} from '../utils/get-player-cost';

export default function PatchNotes(props) {
  return (
    <Layout>
      <Helmet>
        <title>Patch notes</title>
      </Helmet>
      <Section>
        <PageWrapper>
          <Typography variant="h3" gutterBottom>
            Latest &quot;patch notes&quot;
          </Typography>
          <List disablePadding>
            {props.data.superteam.players
              .map(({statistics, ...player}) => {
                if (statistics.length < 2) {
                  return player;
                }

                const [
                  {rating: currentRating},
                  {rating: prevRating}
                ] = statistics;
                const currentCost = ratingToCost(currentRating);
                const prevCost = ratingToCost(prevRating);
                return {
                  ...player,
                  change: currentCost - prevCost
                };
              })
              .filter(player => player.change)
              .sort((a, b) => b.change - a.change)
              .map(player => (
                <ListItem disableGutters key={player.id}>
                  <ListItemText secondary={<Diff value={player.change} />}>
                    {player.ign}
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        </PageWrapper>
      </Section>
      <Footer />
    </Layout>
  );
}

PatchNotes.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  {
    superteam {
      players {
        ...PlayerFragment
      }
    }
  }
`;
