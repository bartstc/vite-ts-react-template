import { HttpService } from "./HttpService";

const headers = {
  "Content-Type": "application/json",
};

const host = process.env.REACT_APP_FAKE_STORE_API_HOST;

export const httpService = new HttpService({
  host,
  headers,
});
