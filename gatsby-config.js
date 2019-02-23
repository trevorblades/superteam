module.exports = {
  siteMetadata: {
    title: 'CS:GO App',
    description: 'Testing HLTV data'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'HLTV',
        fieldName: 'hltv',
        url: 'http://localhost:4000/graphql'
      }
    }
  ]
};
