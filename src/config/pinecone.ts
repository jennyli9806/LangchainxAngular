import { environment } from '../environments/environment.js';
const PINECONE_INDEX = environment.PINECONE_INDEX_NAME

if (!PINECONE_INDEX) {
    throw new Error('Missing Pinecone index name in .env file');
  }
  
  const PINECONE_INDEX_NAME = PINECONE_INDEX ?? '';
  
  const PINECONE_NAME_SPACE = 'pdf-test'; //namespace is optional for your vectors
  
  export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE };
  