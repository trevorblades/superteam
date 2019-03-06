const dotenv = require('dotenv');
const theme = require('./src/utils/theme');

dotenv.config();

module.exports = {
  siteMetadata: {
    title: 'Superteam',
    description:
      'Assemble a dream team of your favourite esports stars and compete against others to see who makes the best picks.'
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
    }
  ]
};
