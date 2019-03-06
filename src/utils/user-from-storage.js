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

export default function userFromStorage() {
  const token = localStorage.getItem('token');
  return userFromToken(token);
}
