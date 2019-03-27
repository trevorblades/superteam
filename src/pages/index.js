import Banner from '../components/banner';
import Divider from '@material-ui/core/Divider';
import Footer from '../components/footer';
import Helmet from 'react-helmet';
import HomepageHero from '../components/homepage-hero';
import HowToPlay from '../components/how-to-play';
import Layout from '../components/layout';
import Prizes from '../components/prizes';
import React from 'react';

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>Free fantasy esports</title>
      </Helmet>
      <HomepageHero />
      <Banner />
      <HowToPlay />
      <Divider />
      <Prizes />
      <Footer />
    </Layout>
  );
}
