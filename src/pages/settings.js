import AuthRequired from '../components/auth-required';
import Footer from '../components/footer';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import NoIndex from '../components/no-index';
import React from 'react';
import {Checkbox, FormControlLabel, NoSsr, Typography} from '@material-ui/core';
import {PageWrapper, Section} from '../components/common';

export default function Settings() {
  return (
    <Layout>
      <NoIndex />
      <NoSsr>
        <AuthRequired>
          <Helmet>
            <title>Settings</title>
          </Helmet>
          <Section>
            <PageWrapper>
              <Typography variant="h3" gutterBottom>
                Settings
              </Typography>
              <div>
                <FormControlLabel
                  disabled
                  control={<Checkbox />}
                  label="Enable weekly email digests (coming soon)"
                />
              </div>
              {/* <br />
              <Typography paragraph color="textSecondary">
                Want to delete your account? Click this big dangerous button:
              </Typography>
              <Button variant="outlined">Delete account</Button> */}
            </PageWrapper>
          </Section>
          <Footer />
        </AuthRequired>
      </NoSsr>
    </Layout>
  );
}
