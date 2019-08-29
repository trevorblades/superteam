import PropTypes from 'prop-types';
import React from 'react';
import chroma from 'chroma-js';
import getPlayerCost, {ratingToCost} from '../../utils/get-player-cost';
import styled from '@emotion/styled';
import {ResponsiveLine} from '@nivo/line';
import {darken, lighten} from 'polished';
import {formatMoney} from '../../utils/format';
import {withTheme} from '@material-ui/core';

const Container = styled.div({
  height: 200,
  fontFamily: 'Inconsolata, monospace'
});

function EntryChart(props) {
  const {error, primary} = props.theme.palette;
  const players = props.players
    .slice()
    .sort((a, b) => getPlayerCost(a) - getPlayerCost(b));
  const igns = players.map(player => player.ign);
  const scale = chroma
    .scale([lighten(0.2, error.light), darken(0.05, error.dark)])
    .domain([0, players.length - 1]);
  return (
    <Container>
      <ResponsiveLine
        animate={false}
        colorBy={data => {
          const color = scale(igns.indexOf(data.id));
          return color.hex();
        }}
        data={players.map(player => ({
          id: player.ign,
          data: player.statistics
            .map(statistic => ({
              x: statistic.week,
              y: ratingToCost(statistic.rating)
            }))
            .sort((a, b) => a.x - b.x)
        }))}
        margin={{
          top: 16,
          right: 16,
          bottom: 60,
          left: 60
        }}
        markers={[
          {
            axis: 'x',
            value: props.week,
            lineStyle: {
              stroke: primary.light,
              strokeWidth: 2
            }
          }
        ]}
        xScale={{
          type: 'linear',
          min: 'auto'
        }}
        axisBottom={{
          orient: 'bottom',
          legend: 'week',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          format: formatMoney,
          tickValues: 5
        }}
        tooltipFormat={formatMoney}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto'
        }}
      />
    </Container>
  );
}

EntryChart.propTypes = {
  players: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  // year: PropTypes.number.isRequired,
  week: PropTypes.number.isRequired
};

export default withTheme(EntryChart);
