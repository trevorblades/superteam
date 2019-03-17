import Colophon from './colophon';
import LastUpdated from './last-updated';
import LogoTitle from './logo-title';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';
import {sectionHorizontalPadding} from './common';
import {withTheme} from '@material-ui/core/styles';

const Container = withTheme()(
  styled.footer(({theme}) => ({
    marginTop: 'auto',
    padding: `${24}px ${sectionHorizontalPadding}px`,
    color: theme.palette.grey[600],
    backgroundColor: theme.palette.grey[100]
  }))
);

const StyledLogoTitle = styled(LogoTitle)({
  marginLeft: -8
});

export default function Footer() {
  return (
    <Container>
      <StyledLogoTitle vector color="inherit" />
      <Typography color="inherit">
        <Colophon />. <LastUpdated />
      </Typography>
    </Container>
  );
}
