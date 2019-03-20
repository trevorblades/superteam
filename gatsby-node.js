exports.createPages = ({actions}) => {
  actions.createRedirect({
    fromPath: '/edit/',
    toPath: '/create',
    isPermanent: true,
    redirectInBrowser: true
  });
};
