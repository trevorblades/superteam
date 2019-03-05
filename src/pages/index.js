import Header from '../components/header';
import Layout from '../components/layout';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';

const Hero = styled.section({
  padding: `${96}px ${72}px`
});

export default function Home() {
  return (
    <Layout>
      <Header />
      <Hero>
        <Typography variant="h1">
          I am feeling
          <br />
          thank you
        </Typography>
      </Hero>
    </Layout>
  );
}
