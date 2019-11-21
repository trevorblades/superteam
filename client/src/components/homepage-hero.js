import PlayerCard from './player-card';
import React from 'react';
import Ticker from './ticker';
import hero from '../assets/images/hero2.jpg';
import styled from '@emotion/styled';
import {Fab} from 'gatsby-theme-material-ui';
import {Grid, Hidden, Typography} from '@material-ui/core';
import {Hero, PageWrapper} from './common';
import {MdAdd} from 'react-icons/md';
import {cover} from 'polished';
import {graphql, useStaticQuery} from 'gatsby';

const Container = styled.div({
  flexShrink: 0,
  color: 'white',
  backgroundColor: 'black',
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
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          description
        }
      }
      superteam {
        player1: player(id: "7412") {
          ...PlayerFragment
        }
        player2: player(id: "11893") {
          ...PlayerFragment
        }
      }
    }
  `);
  return (
    <Container>
      <Hero>
        <PageWrapper>
          <Grid container alignItems="center">
            <Grid item sm={12} md={6}>
              <Typography variant="h2" color="secondary" gutterBottom>
                Free <span style={{color: 'white'}}>fantasy CS:GO esports</span>
              </Typography>
              <Typography paragraph variant="h6">
                {data.site.siteMetadata.description}
              </Typography>
              <Fab variant="extended" color="secondary" to="/create">
                <MdAdd size={24} style={{marginRight: 8}} />
                Create a team
              </Fab>
            </Grid>
            <Grid item md={6}>
              <Hidden smDown implementation="css">
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
              </Hidden>
            </Grid>
          </Grid>
        </PageWrapper>
      </Hero>
      <Ticker />
    </Container>
  );
}
