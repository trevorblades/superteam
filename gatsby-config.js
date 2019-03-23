const dotenv = require('dotenv');
const theme = require('./src/utils/theme');

dotenv.config();

module.exports = {
  siteMetadata: {
    title: 'Superteam',
    description:
      'Assemble a dream team of your favourite esports stars and compete against others to see who makes the best picks.',
    lastUpdated: Date.now()
  },
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-svgr',
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-136591171-1',
        anonymize: true
      }
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'Countries',
        fieldName: 'countries',
        url: 'https://countries.trevorblades.com'
      }
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'Superteam',
        fieldName: 'superteam',
        url: `${process.env.GATSBY_API_URL}/graphql`
      }
    },
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        theme
      }
    },
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: {
        prefixes: ['/teams/*', '/edit/*']
      }
    }
  ]
};
