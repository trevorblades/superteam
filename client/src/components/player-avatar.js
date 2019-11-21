import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {Avatar} from '@material-ui/core';
import {classes} from '../utils/scale';
import {size} from 'polished';

const StyledAvatar = styled(Avatar)(props => size(props.size));

const StyledImage = styled.img(size('150%'));
const PlayerImage = styled(StyledImage)({
  alignSelf: 'flex-start',
  position: 'relative'
});

const Logo = styled(StyledImage)({
  mixBlendMode: 'luminosity',
  opacity: 1 / 3,
  position: 'absolute'
});

export default function PlayerAvatar(props) {
  const [statistic] = props.player.statistics;
  return (
    <StyledAvatar
      size={props.size}
      style={{
        backgroundColor: classes(statistic.percentile).hex()
      }}
    >
      {props.player.team && <Logo src={props.player.team.logo} />}
      <PlayerImage src={props.player.image} />
    </StyledAvatar>
  );
}

PlayerAvatar.propTypes = {
  player: PropTypes.object.isRequired,
  size: PropTypes.number
};
