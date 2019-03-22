import Fab from '@material-ui/core/Fab';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Layout from '../components/layout';
import PlayerCard from '../components/player-card';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import headset from '../assets/images/headset.png';
import hero from '../assets/images/hero.jpg';
import styled from '@emotion/styled';
import {Hero, PageWrapper, Section, sectionPadding} from '../components/common';
import {Link, graphql} from 'gatsby';
import {MdAdd} from 'react-icons/md';
import {cover} from 'polished';
import {withTheme} from '@material-ui/core/styles';

const StyledHero = styled(Hero)({
  color: 'white',
  backgroundImage: `url(${hero})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative'
});

const PlayerCards = styled.div({
  width: 300,
  margin: '0 auto',
  position: 'relative'
});

const PlayerCardWrapper = styled.div({
  transform: 'translateX(-25%) rotate(-10deg)',
  ':not(:last-child)': {
    ...cover(),
    transform: 'translateX(25%) rotate(10deg)'
  }
});

const PrizesSection = styled(Section)({
  position: 'relative'
});

function getImageStyles(key) {
  const padding = sectionPadding[key];
  return {
    height: `calc(100% + ${padding}px)`,
    top: -padding
  };
}

const StyledImage = withTheme()(
  styled.img(getImageStyles('lg'), ({theme}) => {
    return {
      width: '50%',
      maxWidth: 640,
      position: 'absolute',
      left: '50%',
      objectFit: 'cover',
      objectPosition: 'top left',
      [theme.breakpoints.down('md')]: getImageStyles('md'),
      [theme.breakpoints.down('sm')]: {
        width: 300,
        height: 'auto',
        objectFit: 'initial',
        position: 'static',
        float: 'right'
      }
    };
  })
);

export default function Home(props) {
  return (
    <Layout>
      <StyledHero>
        <PageWrapper>
          <Grid container alignItems="center">
            <Grid item sm={12} md={6}>
              <Typography variant="h2" color="secondary" gutterBottom>
                Free{' '}
                <span style={{color: 'white'}}>
                  fantasy CS:GO esports contest
                </span>
              </Typography>
              <Typography variant="body1" color="inherit" paragraph>
                Build a team of current and future CS:GO superstars and win
                prizes based on your team&apos;s quarterly performance.
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
                <PlayerCards>
                  <PlayerCardWrapper>
                    <PlayerCard player={props.data.superteam.player1} />
                  </PlayerCardWrapper>
                  <PlayerCardWrapper>
                    <PlayerCard raised player={props.data.superteam.player2} />
                  </PlayerCardWrapper>
                </PlayerCards>
              </Hidden>
            </Grid>
          </Grid>
        </PageWrapper>
      </StyledHero>
      <PrizesSection>
        <PageWrapper>
          <Grid container>
            <Grid item sm={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Win cool prizes
              </Typography>
              <Hidden only="xs" implementation="css">
                <StyledImage src={headset} />
              </Hidden>
              <Typography variant="body1" paragraph>
                Each week, player values will be updated, and your team will
                increase or decrease in value. At the end of every quarte (three
                months), the top 10 players with the best return on investment
                will win a prize.
              </Typography>
              <Typography variant="overline">This quarter</Typography>
              <Typography>
                This quarter&apos;s prize is the{' '}
                <strong>HyperX Cloud Stinger</strong> headset. It features
                90-degree rotating ear cups, volume control, and a
                swivel-to-mute noise-cancellation microphone. Learn more about
                the HyperX Cloud Stinger{' '}
                <a
                  href="https://www.hyperxgaming.com/us/headsets/cloud-stinger-gaming-headset"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </Typography>
            </Grid>
          </Grid>
        </PageWrapper>
      </PrizesSection>
      <Footer />
    </Layout>
  );
}

Home.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  {
    superteam {
      player1: player(id: "7592") {
        ...PlayerFragment
      }
      player2: player(id: "7687") {
        ...PlayerFragment
      }
    }
  }
`;
