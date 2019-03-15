import React from 'react';

const date = new Date();
export default function Colophon() {
  return (
    <span>&copy; {date.getFullYear()} Superteam. Images &copy; HLTV.org</span>
  );
}
