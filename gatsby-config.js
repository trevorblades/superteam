const dotenv = require('dotenv');
const theme = require('@trevorblades/mui-theme').default;

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
      resolve: '@wapps/gatsby-plugin-material-ui',
      options: {
        theme
      }
    }
  ]
};
