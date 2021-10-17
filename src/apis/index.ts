import client from '@/utils/request';

export function login() {
  return client.request({
    method: 'post',
    url: '/api/login',
    data: {
      name: 'mock-name',
      password: 'mock-password',
    },
  });
}

export function logout() {
  return client.request({
    method: 'get',
    url: '/api/logout',
  });
}
