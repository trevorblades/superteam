import React from 'react';
import format from 'date-fns/format';
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
      render={data => (
        <span>
          Last updated{' '}
          {format(
            data.site.siteMetadata.lastUpdated,
            "MMM d, yyyy 'at' h:mm a"
          )}
        </span>
      )}
    />
  );
}
