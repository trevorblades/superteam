import React from 'react';
import {StaticQuery, graphql} from 'gatsby';

export default function LastUpdated() {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              lastUpdated
            }
          }
        }
      `}
      render={data => {
        const date = new Date(data.site.siteMetadata.lastUpdated);
        return <span>Last updated {date.toLocaleDateString()}</span>;
      }}
    />
  );
}
