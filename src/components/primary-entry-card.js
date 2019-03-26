import ButtonBase from '@material-ui/core/ButtonBase';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PlayerCard from './player-card';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import withProps from 'recompose/withProps';
import {EmptyPlayerCard} from './common';
import {FaStar} from 'react-icons/fa';
import {Link} from 'gatsby';
import {MdShowChart} from 'react-icons/md';
import {getEntryPlayers} from '../utils/get-entry-financials';
import {withTheme} from '@material-ui/core/styles';

const StyledStar = withTheme()(
  styled(FaStar)(({theme}) => ({
    display: 'block',
    fill: theme.palette.primary.main
  }))
);

const PlayerGridItem = withProps({
  item: true,
  md: 2,
  sm: 3,
  xs: 4
})(Grid);

const EmptyCardWrapper = styled(ButtonBase)({
  width: '100%',
  height: '100%'
});

const StyledEmptyPlayerCard = styled(EmptyPlayerCard)({
  width: '100%',
  height: '100%'
});

export default function PrimaryEntryCard(props) {
  return (
    <Paper elevation={20}>
      <CardHeader
        avatar={<StyledStar size={32} />}
        title={props.entry.name}
        titleTypographyProps={{
          variant: 'h6'
        }}
        subheader="Primary team"
      />
      <CardContent>
        <Grid container spacing={16}>
          {getEntryPlayers(props.entry).map(player => (
            <PlayerGridItem key={player.id}>
              <PlayerCard mini static selected player={player} />
            </PlayerGridItem>
          ))}
          <PlayerGridItem>
            <EmptyCardWrapper component={Link} to={`/teams/${props.entry.id}`}>
              <StyledEmptyPlayerCard>
                <MdShowChart size={32} />
                <Typography
                  variant="overline"
                  color="inherit"
                  style={{marginBottom: -8}}
                >
                  Details
                </Typography>
              </StyledEmptyPlayerCard>
            </EmptyCardWrapper>
          </PlayerGridItem>
        </Grid>
      </CardContent>
    </Paper>
  );
}

PrimaryEntryCard.propTypes = {
  entry: PropTypes.object.isRequired
};
