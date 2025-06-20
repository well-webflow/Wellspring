import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const PROJECT_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const supabase = createClient(PROJECT_URL, SUPABASE_KEY);

/**
 * Inserts an association between a site ID and an OAuth access token into the Supabase database.
 * @param siteId The ID of the site to insert the authorization for
 * @param accessToken The OAuth access token granted by Webflow
 * @returns
 */
export async function insertSiteAuthorization(
  siteId: string,
  accessToken: string
) {
  const { error } = await supabase
    .from('Access Tokens')
    .insert({ id: siteId, access_token: accessToken });

  if (error) {
    console.error('Error inserting data:', error);
    return error;
  }
}

/**
 * Retrieves the access token associated with a given site ID from the Supabase database.
 * @param siteId The ID of the site for which to retrieve the access token
 * @returns The access token if found, or null if not found or an error occurs
 */
export async function getAccessTokenBySiteId(siteId: string) {
  const { data, error } = await supabase
    .from('Access Tokens')
    .select('access_token')
    .eq('id', siteId)
    .single();

  if (error) {
    console.error('Error fetching access token:', error);
    return null;
  }

  return data?.access_token || null;
}

/**
 * Retrieves the site ID associated with a given access token from the Supabase database.
 * @param accessToken The OAuth access token for which to retrieve the site ID
 * @returns The site ID if found, or null if not found or an error occurs
 */
export async function getSiteIdByAccessToken(accessToken: string) {
  const { data, error } = await supabase
    .from('Access Tokens')
    .select('id')
    .eq('access_token', accessToken)
    .single();

  if (error) {
    console.error('Error fetching site ID:', error);
    return null;
  }

  return data?.id || null;
}
