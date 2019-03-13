import LastUpdated from './last-updated';
import React from 'react';
import styled from '@emotion/styled';
import {sectionHorizontalPadding} from './common';

const Container = styled.footer({
  padding: `${8}px ${sectionHorizontalPadding}px`
});

export default function Footer() {
  return (
    <Container>
      <LastUpdated />
    </Container>
  );
}
