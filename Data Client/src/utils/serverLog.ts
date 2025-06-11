// Console
import chalk from 'chalk';
import Table from 'cli-table3';

export function logServerInfo(ngrokUrl: string | null, PORT: number) {
  // Create a table to output in the CLI
  const table = new Table({
    head: ['Location', 'URL'], // Define column headers
    colWidths: [20, 80], // Define column widths
  });

  // Add URL information to the table
  table.push(
    ['Backend', `http://localhost:${PORT}`],
    ['Frontend', 'http://localhost:3000']
  );

  // If using an App, also add the Redirect URI to the table
  if (!process.env.SITE_TOKEN) {
    table.push(['Redirect URI', `${ngrokUrl}/auth/callback`]);
  }

  // Console log the table
  console.log(table.toString());

  // If using an App, send a note to adjust the app's Redirect URI
  if (!process.env.SITE_TOKEN) {
    console.log(
      chalk.blue.inverse('\n\nNOTE:'),
      chalk.blue('Update your Redirect URI in your App Settings\n\n')
    );
  }
}
