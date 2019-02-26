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
  padding: 16,
  position: 'sticky',
  bottom: 0
});

const Slots = styled.div({
  display: 'flex',
  marginRight: 40
});

const slotWidth = 90;
const emptySlots = Array(TEAM_SIZE).fill(null);
const Slot = styled.div(props => ({
  width: slotWidth,
  height: slotWidth / CARD_ASPECT_RATIO,
  border: props.empty ? `1px solid ${theme.palette.grey[200]}` : 'none',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  ':not(:last-child)': {
    marginRight: 12
  }
}));

const Finances = styled.div({
  display: 'flex',
  justifyContent: 'space-evenly',
  flexGrow: 1
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
      <Slots>
        {props.selectedPlayers
          .concat(emptySlots)
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
                <Slot key={player.id}>
                  <PlayerCard
                    selected
                    mini
                    percentile={percentile}
                    cost={cost}
                    onClick={props.onPlayerCardClick}
                    player={player}
                  />
                </Slot>
              );
            }

            return <Slot key={index} empty />;
          })}
      </Slots>
      <Finances>
        <div>
          <Typography>Amount spent</Typography>
          <FinanceText color="error">
            ${(TOTAL_BUDGET - props.budget).toLocaleString()}
          </FinanceText>
        </div>
        <div>
          <Typography>Remaining budget</Typography>
          <FinanceText>${props.budget.toLocaleString()}</FinanceText>
        </div>
      </Finances>
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
