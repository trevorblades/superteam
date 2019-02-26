import NumberText from './number-text';
import Paper from '@material-ui/core/Paper';
import PlayerCard, {CARD_ASPECT_RATIO} from './player-card';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {TEAM_SIZE, TOTAL_BUDGET, getPlayerCardProps} from '../util';

const Container = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  padding: 16,
  position: 'sticky',
  bottom: 0
});

const Players = styled.div({
  display: 'flex'
});

const playerWidth = 90;
const emptyPlayers = Array(TEAM_SIZE).fill(null);
const Player = styled.div({
  width: playerWidth,
  height: playerWidth / CARD_ASPECT_RATIO,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  ':not(:last-child)': {
    marginRight: 12
  }
});

const EmptyPlayer = styled(Player)({
  border: `1px solid ${theme.palette.grey[200]}`
});

const Finance = styled.div({
  textAlign: 'center'
});

const FinanceText = withProps({
  variant: 'h4'
})(
  styled(NumberText)({
    // 2 is the number of other characters ($ and , or .)
    width: `${TOTAL_BUDGET.toString().length + 2}ch`
  })
);

export default function Footer(props) {
  return (
    <Container component="footer" square elevation={10}>
      <Finance>
        <Typography>Amount spent</Typography>
        <FinanceText color="error">
          ${(TOTAL_BUDGET - props.budget).toLocaleString()}
        </FinanceText>
      </Finance>
      <Players>
        {props.selectedPlayers
          .concat(emptyPlayers)
          .slice(0, TEAM_SIZE)
          .map((selectedPlayer, index) => {
            if (selectedPlayer) {
              const {player, rating} = selectedPlayer;
              const {cost, percentile} = getPlayerCardProps(
                rating,
                props.minRating,
                props.delta
              );

              return (
                <Player key={player.id}>
                  <PlayerCard
                    selected
                    mini
                    percentile={percentile}
                    cost={cost}
                    onClick={props.onPlayerCardClick}
                    player={player}
                  />
                </Player>
              );
            }

            return <EmptyPlayer key={index} />;
          })}
      </Players>
      <Finance>
        <Typography>Remaining budget</Typography>
        <FinanceText>${props.budget.toLocaleString()}</FinanceText>
      </Finance>
    </Container>
  );
}

Footer.propTypes = {
  budget: PropTypes.number.isRequired,
  selectedPlayers: PropTypes.array.isRequired,
  minRating: PropTypes.number.isRequired,
  delta: PropTypes.number.isRequired,
  onPlayerCardClick: PropTypes.func.isRequired
};
