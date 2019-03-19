import Fab from '@material-ui/core/Fab';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import headset from '../assets/images/headset.png';
import playing from '../assets/images/playing.jpg';
import styled from '@emotion/styled';
import {Hero, Section, sectionPadding} from '../components/common';
import {MdAdd} from 'react-icons/md';
import {withTheme} from '@material-ui/core/styles';

const PageWrapper = styled.div({
  maxWidth: 1200,
  margin: '0 auto'
});

const StyledHero = styled(Hero)({
  color: 'white',
  backgroundImage: `url(${playing})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative'
});

const PrizesSection = styled(Section)({
  position: 'relative'
});

const StyledImage = withTheme()(
  styled.img(({theme}) => ({
    display: 'block',
    width: '100%',
    maxWidth: 600,
    margin: `${sectionPadding * -2}px auto 0`,
    [theme.breakpoints.down('sm')]: {
      marginTop: sectionPadding
    }
  }))
);

export default function Home() {
  return (
    <Layout>
      <StyledHero>
        <PageWrapper>
          <Grid container>
            <Grid item sm={12} md={6}>
              <Typography variant="h2" color="inherit" gutterBottom>
                Build the team of your dreams
              </Typography>
              <Typography variant="body1" color="inherit" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt.
              </Typography>
              <Fab variant="extended" color="primary">
                <MdAdd size={24} style={{marginRight: 8}} />
                Create a team
              </Fab>
            </Grid>
          </Grid>
        </PageWrapper>
      </StyledHero>
      <PrizesSection>
        <PageWrapper>
          <Grid container>
            <Grid item sm={12} md={6}>
              <Typography variant="h3" gutterBottom>
                Win cool prizes!
              </Typography>
              <Typography variant="body1" paragraph>
                Each week, player values will be updated, and your team will
                increase or decrease in value. Every three months, we&apos;ll
                award the 10 players with the best return on investment.
              </Typography>
              <Typography variant="body1">
                This quarter&apos;s prize is a HyperX Cloud Stinger headset. I
                mean, check that thing out 🤯
              </Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <StyledImage src={headset} />
            </Grid>
          </Grid>
        </PageWrapper>
      </PrizesSection>
      <Footer />
    </Layout>
  );
}
