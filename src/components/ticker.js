import Diff from './diff';
import React from 'react';
import styled from '@emotion/styled';
import {Typography, withTheme} from '@material-ui/core';
import {graphql, useStaticQuery} from 'gatsby';
import {ratingToCost} from '../utils/get-player-cost';

const StyledMarquee = withTheme(
  styled.marquee(({theme}) => ({
    display: 'block',
    margin: 0,
    padding: `${8}px 0`,
    color: 'white',
    backgroundColor: theme.palette.action.active
  }))
);

const StyledText = styled(Typography)({
  display: 'inline',
  marginRight: 32
});

export default function Ticker() {
  const data = useStaticQuery(
    graphql`
      {
        superteam {
          players {
            ...PlayerFragment
          }
        }
      }
    `
  );

  const {players} = data.superteam;
  return (
    <StyledMarquee behavior="slide">
      <StyledText color="inherit" variant="button">
        Week {players[0].statistics[0].week} updates
      </StyledText>
      {players
        .map(({statistics, ...player}) => {
          if (statistics.length < 2) {
            return player;
          }

          const [{rating: currentRating}, {rating: prevRating}] = statistics;
          const currentCost = ratingToCost(currentRating);
          const prevCost = ratingToCost(prevRating);
          return {
            ...player,
            change: currentCost - prevCost
          };
        })
        .filter(player => player.change)
        .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
        .map(player => (
          <StyledText
            variant="body2"
            component="span"
            color="inherit"
            key={player.id}
          >
            {player.ign}: <Diff value={player.change} />
          </StyledText>
        ))}
    </StyledMarquee>
  );
}
