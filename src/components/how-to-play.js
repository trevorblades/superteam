import Fab from '@material-ui/core/Fab';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import howToPlay from '../assets/images/how-to-play.png';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {MdAdd} from 'react-icons/md';
import {PageWrapper, Section} from './common';
import {TOTAL_BUDGET} from '../utils/constants';
import {formatMoney} from '../utils/format';

const StyledImage = styled.img({
  display: 'block',
  width: '100%',
  maxWidth: 570,
  margin: `${40}px auto`,
  userSelect: 'none',
  pointerEvents: 'none'
});

export default function HowToPlay() {
  return (
    <Fragment>
      <a name="how-to-play" />
      <Section>
        <PageWrapper mini>
          <Typography variant="h3" gutterBottom>
            How to play
          </Typography>
          <Typography variant="body1" paragraph>
            When you create a team, you will start with a budget of{' '}
            {formatMoney(TOTAL_BUDGET)} to spend on players, each one priced
            differently depending on their recent tournament performance. Click
            on a player card to acquire that player and repeat until you have a
            full 5-person team.
          </Typography>
          <StyledImage src={howToPlay} alt="select players and win" />
          <Typography variant="body1" paragraph>
            As players compete in events during the year, their values will
            change. The object of the game is to amass the greatest gain in
            value at the end of each quarter.
          </Typography>
          <div align="center">
            <Fab
              variant="extended"
              color="primary"
              component={Link}
              to="/create"
            >
              <MdAdd size={24} style={{marginRight: 8}} />
              Create a team
            </Fab>
          </div>
        </PageWrapper>
      </Section>
    </Fragment>
  );
}
