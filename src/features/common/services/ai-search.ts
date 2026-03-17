import {
  AzureKeyCredential,
  SearchClient,
  SearchIndexClient,
  SearchIndexerClient,
} from "@azure/search-documents";
import { DefaultAzureCredential } from "@azure/identity";

const USE_MANAGED_IDENTITIES = process.env.USE_MANAGED_IDENTITIES === "true";
const endpointSuffix =
  process.env.AZURE_SEARCH_ENDPOINT_SUFFIX || "search.windows.net";
const apiKey = process.env.AZURE_SEARCH_API_KEY;
const searchName = process.env.AZURE_SEARCH_NAME;
const indexName = process.env.AZURE_SEARCH_INDEX_NAME;
const endpoint = `https://${searchName}.${endpointSuffix}`;
const debug = process.env.DEBUG === "true";

console.log("Configuration parameters:", {
  USE_MANAGED_IDENTITIES,
  endpointSuffix,
  searchName,
  indexName,
  endpoint,
  apiKeyExists: !!apiKey,
  apiKeyLength: apiKey?.trim().length ?? 0,
});

const validateBaseConfiguration = () => {
  if (!searchName || !searchName.trim()) {
    throw new Error("AZURE_SEARCH_NAME is missing or empty");
  }

  if (!indexName || !indexName.trim()) {
    throw new Error("AZURE_SEARCH_INDEX_NAME is missing or empty");
  }

  if (!endpoint || endpoint.includes("undefined")) {
    throw new Error(`Azure Search endpoint is invalid: ${endpoint}`);
  }
};

export const GetCredential = () => {
  validateBaseConfiguration();

  console.log(
    "Getting credential using",
    USE_MANAGED_IDENTITIES ? "Managed Identities" : "API Key"
  );

  console.log("AZURE_SEARCH_NAME:", searchName);
  console.log("AZURE_SEARCH_INDEX_NAME:", indexName);
  console.log("AZURE_SEARCH_API_KEY exists:", !!apiKey);
  console.log("AZURE_SEARCH_API_KEY length:", apiKey?.trim().length ?? 0);
  console.log("Search endpoint:", endpoint);

  if (USE_MANAGED_IDENTITIES) {
    const credential = new DefaultAzureCredential();

    if (debug) {
      console.log("Credential obtained: DefaultAzureCredential");
    }

    return credential;
  }

  if (!apiKey || !apiKey.trim()) {
    throw new Error("AZURE_SEARCH_API_KEY is missing or empty");
  }

  const credential = new AzureKeyCredential(apiKey.trim());

  if (debug) {
    console.log("Credential obtained: AzureKeyCredential");
  }

  return credential;
};

export const AzureAISearchInstance = <T extends object>() => {
  console.log("Creating Azure AI Search Client Instance");
  validateBaseConfiguration();

  console.log("Using endpoint for SearchClient:", endpoint);
  console.log("Using indexName for SearchClient:", indexName);

  const credential = GetCredential();

  const searchClient = new SearchClient<T>(
    endpoint,
    indexName,
    credential
  );

  console.log("Search Client created successfully");
  return searchClient;
};

export const AzureAISearchIndexClientInstance = () => {
  console.log("Creating Azure AI Search Index Client Instance");
  validateBaseConfiguration();

  console.log("Using endpoint for SearchIndexClient:", endpoint);

  const credential = GetCredential();

  const searchClient = new SearchIndexClient(
    endpoint,
    credential
  );

  console.log("Search Index Client created successfully");
  return searchClient;
};

export const AzureAISearchIndexerClientInstance = () => {
  console.log("Creating Azure AI Search Indexer Client Instance");
  validateBaseConfiguration();

  console.log("Using endpoint for SearchIndexerClient:", endpoint);

  const credential = GetCredential();

  const client = new SearchIndexerClient(
    endpoint,
    credential
  );

  console.log("Search Indexer Client created successfully");
  return client;
};
