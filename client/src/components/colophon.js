import React from 'react';

const date = new Date();
export default function Colophon() {
  return (
    <span>
      &copy; {date.getFullYear()} Superteam. Player images &copy; HLTV.org
    </span>
  );
}
