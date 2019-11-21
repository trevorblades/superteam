import React from 'react';
import {StaticQuery, graphql} from 'gatsby';

export default function LastUpdated() {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            buildTime(formatString: "MMM d, YYYY [at] h:mm a")
          }
        }
      `}
      render={data => <span>Last updated {data.site.buildTime}</span>}
    />
  );
}
