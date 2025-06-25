import axiosInstance from './axios';

export const addWellflowScript = async (
  siteId: string,
  sessionToken: string
) => {
  console.log('SESSION TOKEN:', sessionToken);
  axiosInstance
    .get(`/custom-code/register${siteId}`, {
      headers: {
        authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response.data);
    });
};

export const removeWellflowScript = async (
  siteId: string,
  sessionToken: string
) => {
  axiosInstance
    .get(`/custom-code/remove${siteId}`, {
      headers: { authorization: `Bearer ${sessionToken}` },
    })
    .then((response) => {
      console.log(response.data);
    });
};
