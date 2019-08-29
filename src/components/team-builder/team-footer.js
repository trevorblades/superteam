import Colophon from '../colophon';
import FinanceText from './finance-text';
import LastUpdated from '../last-updated';
import Paper from '@material-ui/core/Paper';
import PlayerCard from '../player-card';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {CARD_ASPECT_RATIO, TEAM_SIZE} from '../../utils/constants';
import {EmptyPlayerCard} from '../common';
import {MdCopyright, MdUpdate} from 'react-icons/md';
import {withTheme} from '@material-ui/core/styles';

const Container = styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  flexShrink: 0,
  marginTop: 'auto',
  padding: 16,
  position: 'sticky',
  bottom: 0
});

const Players = styled.div({
  display: 'flex'
});

const playerWidth = 90;
const emptyPlayers = Array(TEAM_SIZE).fill(null);
const Player = styled(EmptyPlayerCard)({
  width: playerWidth,
  height: playerWidth / CARD_ASPECT_RATIO,
  ':not(:last-child)': {
    marginRight: 12
  }
});

const PlayerCardWrapper = styled.div({
  alignSelf: 'stretch'
});

const Icons = withTheme(
  styled.div(({theme}) => ({
    display: 'flex',
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: theme.palette.text.secondary,
    svg: {
      cursor: 'help',
      ':not(:last-child)': {
        marginRight: 4
      }
    }
  }))
);

export default class TeamFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevAmountSpent: props.amountSpent
    };
  }

  static propTypes = {
    budget: PropTypes.number.isRequired,
    amountSpent: PropTypes.number.isRequired,
    players: PropTypes.array.isRequired,
    onPlayerCardClick: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    if (prevProps.amountSpent !== this.props.amountSpent) {
      this.setState({
        prevAmountSpent: prevProps.amountSpent
      });
    }
  }

  render() {
    return (
      <Container component="footer" square elevation={10}>
        <FinanceText
          title="Amount spent"
          from={this.state.prevAmountSpent}
          to={this.props.amountSpent}
        />
        <Players>
          {this.props.players
            .concat(emptyPlayers)
            .slice(0, TEAM_SIZE)
            .map((player, index) => (
              <Player key={index}>
                {player ? (
                  <PlayerCardWrapper>
                    <PlayerCard
                      selected
                      mini
                      onClick={this.props.onPlayerCardClick}
                      player={player}
                    />
                  </PlayerCardWrapper>
                ) : (
                  <Typography variant="h6" color="inherit">
                    {index + 1}
                  </Typography>
                )}
              </Player>
            ))}
        </Players>
        <FinanceText
          colored
          title="Remaining budget"
          from={this.props.budget - this.state.prevAmountSpent}
          to={this.props.budget - this.props.amountSpent}
        />
        <Icons>
          <Tooltip title={<Colophon />}>
            <MdCopyright size={20} />
          </Tooltip>
          <Tooltip title={<LastUpdated />}>
            <MdUpdate size={20} />
          </Tooltip>
        </Icons>
      </Container>
    );
  }
}
