import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Box, Button, Select, Stack} from '@chakra-ui/core';

export default function RegionSelect(props) {
  return (
    <Fragment>
      <Stack
        isInline
        spacing="4"
        ml="auto"
        display={{
          xs: 'none',
          lg: 'flex'
        }}
      >
        <Button
          variantColor={props.region ? undefined : 'blue'}
          variant={props.region ? 'ghost' : 'solid'}
          onClick={() => props.setRegion('')}
        >
          All regions
        </Button>
        {props.continents.map(continent => {
          const isSelected = continent.code === props.region;
          return (
            <Button
              variantColor={isSelected ? 'blue' : undefined}
              variant={isSelected ? 'solid' : 'ghost'}
              key={continent.code}
              onClick={() => props.setRegion(continent.code)}
            >
              {continent.name}
            </Button>
          );
        })}
      </Stack>
      <Box
        ml="auto"
        display={{
          lg: 'none'
        }}
      >
        <Select
          value={props.region}
          onChange={event => props.setRegion(event.target.value)}
        >
          <option value="">All regions</option>
          {props.continents.map(continent => (
            <option key={continent.code} value={continent.code}>
              {continent.name}
            </option>
          ))}
        </Select>
      </Box>
    </Fragment>
  );
}

RegionSelect.propTypes = {
  region: PropTypes.string,
  setRegion: PropTypes.func.isRequired,
  continents: PropTypes.array.isRequired
};
