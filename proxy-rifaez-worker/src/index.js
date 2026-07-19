/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request) {
	  const originalUrl = new URL(request.url);
  
	  // Proxy to your Render app
	  const newUrl = new URL(`https://domains.rifaez.com${originalUrl.pathname}`);
	  newUrl.search = originalUrl.search;
  
	  const modifiedRequest = new Request(newUrl, {
		method: request.method,
		headers: request.headers,
		body: request.body,
		redirect: request.redirect
	  });
  
	  return fetch(modifiedRequest);
	}
  };
  
