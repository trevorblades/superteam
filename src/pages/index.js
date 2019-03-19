import Fab from '@material-ui/core/Fab';
import Footer from '../components/footer';
import Grid from '@material-ui/core/Grid';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import playing from '../assets/images/playing.jpg';
import styled from '@emotion/styled';
import {Hero, Section} from '../components/common';
import {MdAdd} from 'react-icons/md';

const StyledHero = styled(Hero)({
  color: 'white',
  backgroundImage: `url(${playing})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative'
});

export default function Home() {
  return (
    <Layout>
      <StyledHero>
        <Grid container>
          <Grid item xs={12} sm={6}>
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
      </StyledHero>
      <Section>
        <Typography variant="h2" gutterBottom>
          Next section
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt.
        </Typography>
      </Section>
      <Footer />
    </Layout>
  );
}
