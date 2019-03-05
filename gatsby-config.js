const dotenv = require('dotenv');
const theme = require('./src/utils/theme');

dotenv.config();

module.exports = {
  siteMetadata: {
    title: 'CS:GO App',
    description: 'Testing HLTV data'
  },
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet',
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
        typeName: 'CSGO',
        fieldName: 'csgo',
        url: 'http://localhost:4000'
      }
    },
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        theme
      }
    }
  ]
};
