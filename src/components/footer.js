import LastUpdated from './last-updated';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {sectionHorizontalPadding} from './common';

const Container = styled.footer({
  padding: `${8}px ${sectionHorizontalPadding}px`
});

export default function Footer() {
  return (
    <Container>
      <Typography>
        <LastUpdated />
      </Typography>
    </Container>
  );
}
