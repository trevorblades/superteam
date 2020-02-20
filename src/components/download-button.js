import PropTypes from 'prop-types';
import React, {Fragment, useRef, useState} from 'react';
import logo from '../assets/logo.svg';
import {Button, useTheme} from '@chakra-ui/core';

function readImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // allow CORS-enabled images
    img.onload = () => {
      resolve(img);
    };
    img.src = url;
  });
}

const imagePositions = {
  0: -50,
  1: 450,
  2: 75,
  3: 325,
  4: 200
};

export default function DownloadButton(props) {
  const canvas = useRef(null);
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    const images = await Promise.all(
      props.teamPlayers
        .slice()
        .sort((a, b) => a.rating - b.rating)
        .map(player => readImage(player.image))
    );

    const ctx = canvas.current.getContext('2d');

    const gradient = ctx.createLinearGradient(400, 0, 400, 450);
    gradient.addColorStop(0, colors.gray[100]);
    gradient.addColorStop(1, colors.gray[400]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 450);

    images.forEach((img, index) => {
      ctx.drawImage(img, imagePositions[index], 33);
    });

    const logoImg = await readImage(logo);
    ctx.drawImage(logoImg, 24, 366, 60, 60);

    const anchor = document.createElement('a');
    anchor.href = canvas.current.toDataURL('image/jpeg');
    anchor.download = 'superteam.jpg';
    anchor.click();

    setLoading(false);
  }

  return (
    <Fragment>
      <Button
        isLoading={loading}
        loadingText="Downloading"
        variantColor="green"
        leftIcon="download"
        onClick={handleClick}
      >
        Download team
      </Button>
      <canvas width="800" height="450" ref={canvas} style={{display: 'none'}} />
    </Fragment>
  );
}

DownloadButton.propTypes = {
  teamPlayers: PropTypes.array.isRequired
};
