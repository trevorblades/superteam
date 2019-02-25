import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import deepPurple from '@material-ui/core/colors/deepPurple';
import emojiFlags from 'emoji-flags';
import green from '@material-ui/core/colors/green';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {cover, transparentize} from 'polished';

function getGradient(color, direction) {
  return `linear-gradient(${[direction, color, transparentize(1, color)]})`;
}

const aspectRatio = 3 / 4;
const StyledCard = styled(Card)({
  paddingTop: `${(1 / aspectRatio) * 100}%`,
  position: 'relative'
});

const TeamLogo = styled.div(cover(), {
  backgroundSize: '150%',
  backgroundPosition: 'center',
  mixBlendMode: 'luminosity',
  opacity: 0.5
});

const StyledCardActionArea = styled(CardActionArea)(cover(), {
  display: 'flex',
  alignItems: 'stretch',
  flexDirection: 'column'
});

const StatusBar = styled.div({
  padding: `${12}px ${16}px`,
  color: 'white',
  backgroundImage: `linear-gradient(${[
    'to right',
    transparentize(0.25, 'black'),
    transparentize(0.5, 'black')
  ]})`
});

const PlayerImage = styled.img({
  height: '100%',
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: 0
});

const PlayerName = styled.div({
  marginTop: 'auto',
  position: 'relative'
});

const playerNameBackground = 'white';
const PlayerNameCurve = styled.svg({
  display: 'block',
  width: '100%',
  height: 48,
  fill: playerNameBackground
});

const PlayerNameInner = styled.div({
  padding: 24,
  paddingTop: 0,
  backgroundColor: playerNameBackground
});

const PlayerNameText = withProps({
  noWrap: true,
  align: 'center'
})(Typography);

const Glow = styled.div({
  width: '100%',
  height: '50%',
  mixBlendMode: 'overlay', // might be better without this
  position: 'absolute',
  bottom: 0,
  left: 0
});

export default class PlayerCard extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    player: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    range: PropTypes.number.isRequired,
    minRating: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired
  };

  onClick = () => {
    this.props.onClick(this.props.player);
  };

  get color() {
    const percentile =
      (this.props.player.statistics.rating - this.props.minRating) /
      this.props.range;
    if (percentile >= 0.9) {
      return amber[500];
    } else if (percentile >= 0.8) {
      return deepPurple[500];
    } else if (percentile >= 0.5) {
      return blue[500];
    } else if (percentile >= 0.25) {
      return green[500];
    }

    return theme.palette.grey[500];
  }

  render() {
    return (
      <StyledCard
        style={{
          backgroundImage: getGradient(this.color, 'to bottom')
        }}
      >
        <TeamLogo
          style={{
            backgroundImage: `url(${this.props.player.team.logo})`
          }}
        />
        <StyledCardActionArea
          disabled={this.props.disabled}
          onClick={this.onClick}
        >
          <StatusBar>
            <Typography color="inherit" variant="h6">
              {this.props.selected ? '✅ Acquired' : '$3,000'}
              {/* use toLocaleString to format cost */}
            </Typography>
          </StatusBar>
          <Typography>{this.props.player.statistics.rating}</Typography>
          <PlayerImage src={this.props.player.image} />
          <Glow
            style={{
              backgroundImage: getGradient(this.color, 'to top')
            }}
          />
          <PlayerName>
            <PlayerNameCurve viewBox="0 0 100 48" preserveAspectRatio="none">
              <path d="M 0,48 Q 50,0 100,48 Z" fill="white" />
            </PlayerNameCurve>
            <PlayerNameInner>
              <PlayerNameText variant="h6">
                {this.props.player.ign}
              </PlayerNameText>
              <PlayerNameText>
                {emojiFlags.countryCode(this.props.player.country.code).emoji}{' '}
                {this.props.player.name}
              </PlayerNameText>
            </PlayerNameInner>
          </PlayerName>
        </StyledCardActionArea>
      </StyledCard>
    );
  }
}
