import { ApiService } from "./ApiService";

const headers = {
  "Content-Type": "application/json",
};

export const host = import.meta.env.VITE_FAKE_STORE_API_HOST;

export const httpService = new ApiService({
  host,
  headers,
});

export {
  InternalServerException,
  ResourceNotFoundException,
} from "./exceptions";
export { AjaxError } from "./AjaxError";
