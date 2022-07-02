import axios from 'axios';

/**
 * Perform a GET request at the root URL of each microservice to wake it up
 */
export async function wakeup() {
  const microserviceURLs = process.env.MICROSERVICE_URLS.split(',');

  const requests = new Array<Promise<any>>();
  for (const url of microserviceURLs) {
    requests.push(axios.get(url));
  }

  await Promise.all(requests).catch(() => {});
}