import decode from 'jwt-decode';

export function userFromToken(token) {
  try {
    const user = decode(token);
    return {
      ...user,
      __typename: 'User'
    };
  } catch (error) {
    return null;
  }
}
