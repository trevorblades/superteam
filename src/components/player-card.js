import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';

const FlexAlignCenter = styled.div({
  display: 'flex',
  alignItems: 'center'
});

const TeamLogo = styled.img({
  height: 32,
  marginRight: 8
});

const flagHeight = 24;
const Flag = styled.img({
  height: flagHeight,
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

  render() {
    const {logo, name: teamName} = this.props.player.team;
    return (
      <Card>
        <CardActionArea disabled={this.props.disabled} onClick={this.onClick}>
          <CardContent>
            <Typography>
              {this.props.selected ? 'Selected' : 'Not selected'}
            </Typography>
            {/* <img src={this.props.player.image} /> */}
            <FlexAlignCenter>
              <TeamLogo src={logo} alt={teamName} title={teamName} />
              <Typography variant="h6">{this.props.player.ign}</Typography>
            </FlexAlignCenter>
            <Typography variant="caption" gutterBottom>
              {this.props.player.name}
            </Typography>
            <FlexAlignCenter>
              <Flag
                src={`https://www.countryflags.io/${
                  this.props.player.country.code
                }/flat/${flagHeight * 2}.png`}
              />
              <Typography>{this.props.player.country.name}</Typography>
            </FlexAlignCenter>
            <Typography>{this.props.player.statistics.rating}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}
