import PropTypes from 'prop-types';
import React, {Fragment, useRef, useState} from 'react';
import logo from '../assets/logo.svg';
import {Button, useTheme} from '@chakra-ui/core';

function loadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.crossOrigin = 'Anonymous'; // allow CORS-enabled images
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
  const canvas = useRef();
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    const ctx = canvas.current.getContext('2d');

    // create a gradient backdrop
    const gradient = ctx.createLinearGradient(400, 0, 400, 450);
    gradient.addColorStop(0, colors.gray[100]);
    gradient.addColorStop(1, colors.gray[400]);

    // fill the background with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 450);

    // create loaded Image instances
    const images = await Promise.all(
      props.teamPlayers
        .slice()
        .sort((a, b) => a.rating - b.rating)
        .map(player => loadImage(player.image))
    );

    // loop through images and draw them on the canvas
    images.forEach((img, index) => {
      ctx.drawImage(img, imagePositions[index], 33);
    });

    // load the logo and draw it
    const logoImg = await loadImage(logo);
    ctx.drawImage(logoImg, 24, 366, 64, 64);

    // simulate clicking on an anchor element with download attr
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
        colorScheme="green"
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
