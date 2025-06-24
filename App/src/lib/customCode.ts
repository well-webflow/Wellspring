import { WebflowSiteInfo } from '../context/authContext';
import axiosInstance from './axios';

export const addWaterfallScript = async (
  siteData: WebflowSiteInfo | null,
  sessionToken: string
) => {
  if (!siteData) return;
  console.log(siteData);

  axiosInstance
    .get(`/custom-code/register${siteData.siteId}`, {
      headers: { authorization: `Bearer ${sessionToken}` },
    })
    .then((response) => {
      console.log(response.data);
    });
};
