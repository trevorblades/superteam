import React, {Fragment} from 'react';
import howToPlay from '../assets/images/how-to-play.png';
import styled from '@emotion/styled';
import {Fab, Typography} from '@material-ui/core';
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

export function HowToPlayTextA() {
  return (
    <Fragment>
      When you create a team, you will start with a budget of{' '}
      {formatMoney(TOTAL_BUDGET)} to spend on players, each one priced
      differently based on their{' '}
      <a href="https://www.hltv.org/" target="_blank" rel="noopener noreferrer">
        HLTV
      </a>{' '}
      rating for recent LAN events. Simply click on a player card to acquire
      that player and repeat until you have a full 5-person team. You must{' '}
      <a
        href="https://twitter.com/superteamgg/status/1112817777952251904"
        target="_blank"
        rel="noopener noreferrer"
      >
        be strategic
      </a>{' '}
      with your spending and decide how you want to spread your team&apos;s
      talent around.
    </Fragment>
  );
}

export function HowToPlayTextB() {
  return (
    <Fragment>
      As players compete in events during the year, their values will increase
      and decrease. The object of the game is to build a team that yields the
      best{' '}
      <a
        href="https://en.wikipedia.org/wiki/Return_on_investment"
        target="_blank"
        rel="noopener noreferrer"
      >
        return on investment
      </a>{' '}
      at the end of each quarter. You <strong>are allowed</strong> to swap
      players on your team at any time.
    </Fragment>
  );
}

export default function HowToPlay() {
  return (
    <Fragment>
      <a name="how-to-play" />
      <Section>
        <PageWrapper mini>
          <Typography variant="h3" gutterBottom>
            How to play
          </Typography>
          <Typography paragraph>
            <HowToPlayTextA />
          </Typography>
          <StyledImage src={howToPlay} alt="select players and win" />
          <Typography paragraph>
            <HowToPlayTextB />
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