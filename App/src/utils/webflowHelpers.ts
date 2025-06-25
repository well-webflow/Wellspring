import { WebflowSiteInfo } from '../context/types';
import axiosInstance from './axios';

export const isWellflowScriptInstalled = async (
  siteData: WebflowSiteInfo | null,
  sessionToken: string
) => {
  const siteId = siteData?.siteId;
  if (!siteData || !siteId) return;

  axiosInstance
    .get(`/custom-code/installed`, {
      headers: { authorization: `Bearer ${sessionToken}` },
      params: { siteId },
    })
    .then((response) => {
      console.log(response.data);
      return response.data.installed;
    });
  return false;
};
