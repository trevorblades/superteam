import Fab from '@material-ui/core/Fab';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import headset from '../assets/images/headset.png';
import playing from '../assets/images/playing.jpg';
import styled from '@emotion/styled';
import {Hero, PageWrapper, Section, sectionPadding} from '../components/common';
import {Link} from 'gatsby';
import {MdAdd} from 'react-icons/md';
import {TOTAL_BUDGET} from '../utils/constants';
import {formatMoney} from '../utils/format';
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
                Given a {formatMoney(TOTAL_BUDGET)} budget, you must assemble a
                team of current and future CS:GO superstars. Their values will
                change over time based on LAN tournament performances, and your
                team will see gains or losses.
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
