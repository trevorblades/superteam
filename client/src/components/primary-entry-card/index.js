import PlayerCard from '../player-card';
import PropTypes from 'prop-types';
import React from 'react';
import ShareButton from './share-button';
import arrayToSentence from 'array-to-sentence';
import styled from '@emotion/styled';
import {
  ButtonBase,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
  withTheme
} from '@material-ui/core';
import {EmptyPlayerCard} from '../common';
import {FaStar} from 'react-icons/fa';
import {Link} from 'gatsby';
import {MdShowChart} from 'react-icons/md';
import {getEntryPlayers} from '../../utils/get-entry-financials';
import {withProps} from 'recompose';

const StyledStar = withTheme(
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
  const players = getEntryPlayers(props.entry);
  return (
    <Paper elevation={20}>
      <CardHeader
        action={
          <ShareButton
            text={`I picked ${arrayToSentence(
              players.map(player => player.ign),
              {lastSeparator: ', and '}
            )}`}
          />
        }
        avatar={<StyledStar size={32} />}
        title={props.entry.name}
        titleTypographyProps={{
          variant: 'h6'
        }}
        subheader="Primary team"
      />
      <CardContent>
        <Grid container spacing={2}>
          {players.map(player => (
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
