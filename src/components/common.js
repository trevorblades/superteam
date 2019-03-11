import Avatar from '@material-ui/core/Avatar';
import mapProps from 'recompose/mapProps';
import styled from '@emotion/styled';
import {classes} from '../utils/scale';
import {css} from '@emotion/core';
import {size} from 'polished';

export const Hero = styled.section({
  padding: `${96}px ${72}px`
});

export const Section = styled.section({
  padding: `${56}px ${48}px`
});

export const PlayerAvatar = mapProps(({player, ...props}) => {
  const [statistic] = player.statistics;
  return {
    ...props,
    src: player.image,
    style: {
      backgroundColor: classes(statistic.percentile).hex()
    }
  };
})(
  styled(Avatar)(props => size(props.size), {
    alignItems: 'flex-start',
    img: css(size('150%'), {
      objectPosition: 'top'
    })
  })
);
