import PropTypes from 'prop-types';
import React from 'react';
import formatMoney from '../utils/format-money';
import styled from '@emotion/styled';
import {ResponsiveLine} from '@nivo/line';
import {percentileToCost} from '../utils/get-player-cost';

const Container = styled.div({
  height: 200,
  fontFamily: 'Inconsolata, monospace'
});

export default function EntryChart(props) {
  return (
    <Container>
      <ResponsiveLine
        data={props.players.map(player => ({
          id: player.ign,
          data: player.statistics
            .map(statistic => ({
              x: statistic.week,
              y: percentileToCost(statistic.percentile)
            }))
            .sort((a, b) => a.x - b.x)
        }))}
        margin={{
          top: 16,
          bottom: 60,
          right: 16,
          left: 60
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
          stacked: false,
          min: 'auto',
          max: 'auto'
        }}
      />
    </Container>
  );
}

EntryChart.propTypes = {
  players: PropTypes.array.isRequired
};
