import NumberText from './number-text';
import PropTypes from 'prop-types';
import React, {Fragment, PureComponent} from 'react';
import emojiFlags from 'emoji-flags';
import styled from '@emotion/styled';
import {CARD_ASPECT_RATIO} from '../utils/constants';
import {Card, CardActionArea, Typography} from '@material-ui/core';
import {Transition, animated} from 'react-spring/renderprops';
import {classes} from '../utils/scale';
import {cover, transparentize} from 'polished';
import {formatMoney} from '../utils/format';
import {graphql} from 'gatsby';
import {mapProps, withProps} from 'recompose';
import {ratingToCost} from '../utils/get-player-cost';

const StyledCard = styled(Card)(props => ({
  paddingTop: `${(1 / CARD_ASPECT_RATIO) * 100}%`,
  position: 'relative',
  cursor: props.disabled ? 'not-allowed' : 'auto',
  filter: props.disabled ? 'grayscale(85%)' : 'none',
  transition: 'filter 100ms ease-in-out',
  // fixes jitter and flickering issues
  // https://greensock.com/forums/topic/16385-chrome-bug-when-i-scale-an-element-with-background-image-the-image-flickers/?tab=comments#comment-72139
  WebkitBackfaceVisibility: 'hidden',
  WebkitTransform: 'perspective(1000px)'
}));

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

const Status = styled.div({
  padding: `${12}px ${16}px`,
  color: 'white',
  backgroundImage: `linear-gradient(${[
    'to right',
    transparentize(0.25, 'black'),
    transparentize(0.5, 'black')
  ]})`
});

const StatusText = withProps({
  variant: 'h6',
  color: 'inherit'
})(NumberText);

const MiniStatus = styled(Typography)({
  margin: 4
});

const Statistics = styled.div({
  padding: 16
});

const Statistic = mapProps(props => ({
  variant: 'subtitle2',
  children: `${props.title}: ${props.value}`
}))(Typography);

const PlayerImage = styled.img(props => ({
  height: '100%',
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: props.centered ? '50%' : 0,
  transform: props.centered ? 'translate(-50%)' : 'none'
}));

const PlayerName = styled.div({
  marginTop: 'auto',
  position: 'relative'
});

const playerNamePadding = 24;
const playerNameBackground = 'white';
const PlayerNameInner = styled.div({
  padding: playerNamePadding,
  paddingTop: 0,
  backgroundColor: playerNameBackground
});

const PlayerNameCurve = styled.svg({
  display: 'block',
  width: '100%',
  height: playerNamePadding * 2,
  fill: playerNameBackground
});

const PlayerNameText = withProps({
  noWrap: true,
  align: 'center'
})(Typography);

const MiniPlayerName = styled.div({
  marginTop: 'auto',
  padding: 4,
  backgroundColor: 'white',
  position: 'relative'
});

const Glow = styled.div({
  width: '100%',
  height: '50%',
  mixBlendMode: 'overlay', // might be better without this
  position: 'absolute',
  bottom: 0,
  left: 0
});

function linearGradient(color, direction) {
  return `linear-gradient(${[direction, color, transparentize(1, color)]})`;
}

function getStatus(selected, cost) {
  return selected ? '✅ Acquired' : formatMoney(cost);
}

export default class PlayerCard extends PureComponent {
  static propTypes = {
    raised: PropTypes.bool,
    disabled: PropTypes.bool,
    static: PropTypes.bool,
    player: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    mini: PropTypes.bool
  };

  onClick = () => {
    this.props.onClick(this.props.player);
  };

  renderStatistics(statistics) {
    const headshots = statistics.headshots * 100;
    return (
      <Statistics>
        <Statistic title="K/D" value={statistics.kdRatio} />
        <Statistic title="ADR" value={statistics.damagePerRound} />
        <Statistic
          title="HS%"
          value={headshots.toLocaleString({
            style: 'percent'
          })}
        />
      </Statistics>
    );
  }

  render() {
    const {team, statistics, country, ign, name, image} = this.props.player;
    const [statistic] = statistics;
    const cost = ratingToCost(statistic.rating);
    const color = classes(statistic.percentile).hex();
    return (
      <StyledCard
        raised={this.props.raised}
        disabled={this.props.disabled}
        style={{
          backgroundImage: linearGradient(color, 'to bottom')
        }}
      >
        <TeamLogo
          style={{
            backgroundImage: team && `url(${team.logo})`
          }}
        />
        <StyledCardActionArea
          disabled={!this.props.onClick || this.props.disabled}
          onClick={this.onClick}
        >
          {this.props.mini ? (
            <MiniStatus variant="caption">
              {this.props.selected ? '✅' : '❌'}
            </MiniStatus>
          ) : (
            <Fragment>
              <Status>
                <StatusText>
                  {this.props.static ? (
                    getStatus(this.props.selected, cost)
                  ) : (
                    <Fragment>
                      <Transition
                        native
                        items={this.props.selected}
                        initial={{
                          position: 'absolute',
                          transform: 'translateY(0%)'
                        }}
                        from={{
                          opacity: 0,
                          position: 'absolute',
                          transform: 'translateY(0%)'
                        }}
                        enter={{
                          opacity: 1,
                          transform: 'translateY(0%)'
                        }}
                        leave={{
                          opacity: 0,
                          transform: 'translateY(-100%)'
                        }}
                      >
                        {selected => style => (
                          <animated.span style={style}>
                            {getStatus(selected, cost)}
                          </animated.span>
                        )}
                      </Transition>
                      {/* space needed because the text is positioned absolutely */}
                      &nbsp;
                    </Fragment>
                  )}
                </StatusText>
              </Status>
              {this.renderStatistics(statistic)}
            </Fragment>
          )}
          <PlayerImage src={image} centered={this.props.mini} />
          <Glow
            style={{
              backgroundImage: linearGradient(color, 'to top')
            }}
          />
          {this.props.mini ? (
            <MiniPlayerName>
              <Typography align="center" noWrap variant="caption">
                {ign}
              </Typography>
            </MiniPlayerName>
          ) : (
            <PlayerName>
              <PlayerNameCurve viewBox="0 0 100 48" preserveAspectRatio="none">
                <path d="M 0,48 Q 50,0 100,48 Z" fill="white" />
              </PlayerNameCurve>
              <PlayerNameInner>
                <PlayerNameText variant="h6">{ign}</PlayerNameText>
                <PlayerNameText>
                  {emojiFlags.countryCode(country).emoji} {name}
                </PlayerNameText>
              </PlayerNameInner>
            </PlayerName>
          )}
        </StyledCardActionArea>
      </StyledCard>
    );
  }
}

export const query = graphql`
  fragment PlayerFragment on Superteam_Player {
    id
    name
    ign
    image
    country
    team {
      name
      logo
    }
    statistics {
      rating
      percentile
      kdRatio
      damagePerRound
      headshots
      week
      year
    }
  }
`;