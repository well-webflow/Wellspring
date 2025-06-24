import express from 'express';
import jwt from '../utils/jwt';
import { WebflowClient } from 'webflow-api';
import ssri from 'ssri';

const router = express.Router();

router.get(
  '/register:siteId',
  jwt.authenticateSessionToken,
  async (req, res) => {
    console.log('Received request on /custom-code/register');

    const accessToken: any = req.accessToken;
    const siteId = req.params.siteId;

    const webflow = new WebflowClient({ accessToken });
    const scripts = await webflow.scripts.list(siteId);

    let wellflowScript = getWellflowScript(scripts.registeredScripts!!);

    const hostedLocation =
      'https://cdn.jsdelivr.net/npm/well-waterfall@1.0.3/dist/waterfall.js';
    const integrity = await generateIntegrity(hostedLocation);

    if (!wellflowScript) {
      const data = await webflow.scripts.registerHosted(siteId, {
        hostedLocation,
        integrityHash: integrity,
        version: '1.0.3',
        displayName: 'Wellflow',
      });
      wellflowScript = data;
    }

    const siteData = await webflow.sites.scripts.upsertCustomCode(siteId, {
      scripts: [
        { id: wellflowScript.id!!, location: 'header', version: '1.0.3' },
      ],
    });

    res.json(siteData);
  }
);

function getWellflowScript(scripts: any[]) {
  return scripts.find((script) => script.id === 'wellflow');
}

async function generateIntegrity(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch script: ${res.statusText}`);
  const buffer = await res.arrayBuffer();
  return ssri
    .fromData(Buffer.from(buffer), { algorithms: ['sha384'] })
    .toString();
}

export default router;
