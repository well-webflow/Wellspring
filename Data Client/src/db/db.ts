import { createClient, PostgrestError } from '@supabase/supabase-js';

// Initialize Supabase Client
const PROJECT_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const supabase = createClient(PROJECT_URL, SUPABASE_KEY);

/**
 * Inserts an association between a site ID and an OAuth access token into Supabase.
 * @param siteId The ID of the site to insert the authorization for
 * @param accessToken The OAuth access token granted by Webflow
 * @returns
 */
async function insertSiteAuthorization(siteId: string, accessToken: string) {
  const { error } = await supabase
    .from('site_authorizations')
    .insert({ id: siteId, access_token: accessToken });

  if (error) {
    console.error('Error inserting site authorization:', error);
    return error;
  }
}

/**
 * Inserts an association between a user ID and an OAuth access token into Supabase.
 * @param userId
 * @param accessToken
 * @returns
 */
async function insertUserAuthorization(userId: string, accessToken: string) {
  const { error } = await supabase
    .from('user_authorizations')
    .insert({ id: userId, access_token: accessToken });

  if (error) {
    console.error('Error inserting user authorization:', error);
    return error;
  }
}

/**
 * Retrieves the access token associated with a given site ID from the Supabase database.
 * @param siteId The ID of the site for which to retrieve the access token
 * @returns The access token if found, or null if not found or an error occurs
 */
async function getAccessTokenFromSiteId(
  siteId: string,
  callback: (error: Error | null, accessToken: string | null) => void
) {
  const { data, error } = await supabase
    .from('site_authorizations')
    .select('access_token')
    .eq('id', siteId)
    .single();

  if (error) {
    console.error('Error fetching access token:', error);
    return callback(error, null);
  }
  if (data && data.access_token) {
    return callback(null, data.access_token);
  } else {
    return callback(new Error('Access token not found for site ID'), null);
  }
}

/**
 * Verifies the Webflow User has an access token
 * @param userId The ID of the user for whom to retrieve the access token
 * @param callback
 */
function getAccessTokenFromUserId(
  userId: string,
  callback: (error: Error | null, accessToken: string | null) => void
) {
  // Retrieve the access token from the database
  supabase
    .from('user_authorizations')
    .select('access_token')
    .eq('id', userId)
    .single()
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching access token:', error);
        callback(error, null);
      } else {
        callback(null, data?.access_token || null);
      }
    });
}

export default {
  supabase,
  insertSiteAuthorization,
  insertUserAuthorization,
  getAccessTokenFromSiteId,
  getAccessTokenFromUserId,
};
