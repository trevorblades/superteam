import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import emojiFlags from 'emoji-flags';
import styled from '@emotion/styled';
import {cover} from 'polished';

const aspectRatio = 3 / 4;
const StyledCard = styled(Card)({
  paddingTop: `${(1 / aspectRatio) * 100}%`,
  position: 'relative'
});

const StyledCardActionArea = styled(CardActionArea)(cover());

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
});

const PlayerName = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto'
});

const TeamLogo = styled.img({
  height: 32,
  marginRight: 8
});

export default class PlayerCard extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    player: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired
  };

  onClick = () => {
    this.props.onClick(this.props.player);
  };

  renderTeamLogo({logo, teamName}) {
    return <TeamLogo src={logo} alt={teamName} title={teamName} />;
  }

  render() {
    return (
      <StyledCard>
        <StyledCardActionArea
          disabled={this.props.disabled}
          onClick={this.onClick}
        >
          <StyledCardContent
            style={{
              backgroundImage: [
                'linear-gradient(transparent, white)',
                `url(${this.props.player.image})`
              ]
            }}
          >
            <Typography>
              {this.props.selected ? 'Selected' : 'Not selected'}
            </Typography>
            <Typography>{this.props.player.statistics.rating}</Typography>
            <PlayerName>
              {this.renderTeamLogo(this.props.player.team)}
              <Typography variant="h6">{this.props.player.ign}</Typography>
            </PlayerName>
            <Typography variant="subtitle2">
              {emojiFlags.countryCode(this.props.player.country.code).emoji}{' '}
              {this.props.player.name}
            </Typography>
          </StyledCardContent>
        </StyledCardActionArea>
      </StyledCard>
    );
  }
}
