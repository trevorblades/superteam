import Fab from '@material-ui/core/Fab';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import headset from '../assets/images/headset.png';
import playing from '../assets/images/playing.jpg';
import styled from '@emotion/styled';
import {Hero, PageWrapper, Section, sectionPadding} from '../components/common';
import {Link} from 'gatsby';
import {MdAdd} from 'react-icons/md';
import {withTheme} from '@material-ui/core/styles';

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
    margin: `${sectionPadding * -2}px auto ${sectionPadding * -1}px`,
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
              <Fab
                variant="extended"
                color="primary"
                component={Link}
                to="/create"
              >
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
                Win cool prizes
              </Typography>
              <Typography variant="body1" paragraph>
                Each week, player values will be updated, and your team will
                increase or decrease in value. At the end of every quarte (three
                months), the top 10 players with the best return on investment
                will win a prize.
              </Typography>
              <Typography variant="overline">This quarter</Typography>
              <Typography variant="body1">
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
