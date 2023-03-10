import { HttpService } from "./HttpService";

const headers = {
  "Content-Type": "application/json",
};

export const host = import.meta.env.VITE_FAKE_STORE_API_HOST;

export const httpService = new HttpService({
  host,
  headers,
});

export {
  InternalServerException,
  ResourceNotFoundException,
} from "./exceptions";
