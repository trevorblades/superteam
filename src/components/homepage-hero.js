import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import PlayerCard from './player-card';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import hero from '../assets/images/hero2.jpg';
import styled from '@emotion/styled';
import {Hero, PageWrapper} from './common';
import {Link, StaticQuery, graphql} from 'gatsby';
import {MdAdd} from 'react-icons/md';
import {cover} from 'polished';

const StyledHero = styled(Hero)({
  flexShrink: 0,
  color: 'white',
  backgroundImage: `url(${hero})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  overflow: 'hidden',
  position: 'relative'
});

const PlayerCards = styled.div({
  width: 300,
  margin: '0 auto',
  position: 'relative'
});

const PlayerCardWrapper = styled.div({
  transform: 'translate(-20%, -5%) rotate(-10deg)',
  ':not(:last-child)': {
    ...cover(),
    transform: 'translate(35%, 5%) rotate(12deg)'
  }
});

export default function HomepageHero() {
  return (
    <StyledHero>
      <PageWrapper centered>
        <Grid container alignItems="center">
          <Grid item sm={12} md={6}>
            <Typography variant="h2" color="secondary" gutterBottom>
              Free <span style={{color: 'white'}}>fantasy CS:GO esports</span>
            </Typography>
            <Typography variant="body1" paragraph color="inherit">
              Build a team of current and future CS:GO superstars and{' '}
              <a href="#prizes">earn prizes</a> based on your team&apos;s
              quarterly performance.
            </Typography>
            <Fab
              variant="extended"
              color="secondary"
              component={Link}
              to="/create"
            >
              <MdAdd size={24} style={{marginRight: 8}} />
              Create a team
            </Fab>
          </Grid>
          <Grid item md={6}>
            <Hidden smDown implementation="css">
              <StaticQuery
                query={graphql`
                  {
                    superteam {
                      player1: player(id: "7398") {
                        ...PlayerFragment
                      }
                      player2: player(id: "7687") {
                        ...PlayerFragment
                      }
                    }
                  }
                `}
                render={data => (
                  <PlayerCards>
                    <PlayerCardWrapper>
                      <PlayerCard static player={data.superteam.player1} />
                    </PlayerCardWrapper>
                    <PlayerCardWrapper>
                      <PlayerCard
                        raised
                        static
                        selected
                        player={data.superteam.player2}
                      />
                    </PlayerCardWrapper>
                  </PlayerCards>
                )}
              />
            </Hidden>
          </Grid>
        </Grid>
      </PageWrapper>
    </StyledHero>
  );
}
