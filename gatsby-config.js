module.exports = {
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-chakra-ui',
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
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/logo.svg'
      }
    }
  ]
};
