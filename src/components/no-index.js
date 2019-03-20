import Helmet from 'react-helmet';
import React from 'react';

export default function NoIndex() {
  return (
    <Helmet>
      <meta name="robots" content="noindex" />
    </Helmet>
  );
}
