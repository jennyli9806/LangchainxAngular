import { PineconeClient } from '@pinecone-database/pinecone';
import { environment } from '../environments/environment';
const PINECONE_ENV = environment.PINECONE_ENVIRONMENT
const PINECONE_KEY = environment.PINECONE_API_KEY

if (!PINECONE_ENV || !PINECONE_KEY) {
  throw new Error('Pinecone environment or api key vars missing');
}

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: PINECONE_ENV ?? '', //this is in the dashboard
      apiKey: PINECONE_KEY ?? '',
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

export const pinecone = await initPinecone();