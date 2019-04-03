import AuthRequired from '../components/auth-required';
import Checkbox from '@material-ui/core/Checkbox';
import Footer from '../components/footer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Helmet from 'react-helmet';
import Layout from '../components/layout';
import NoIndex from '../components/no-index';
import NoSsr from '@material-ui/core/NoSsr';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {PageWrapper, Section} from '../components/common';
// import Button from '@material-ui/core/Button';

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
