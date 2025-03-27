import baseApi from "..";
import { IApplicator, IApplicatorResponse } from "../../types/applicator";
import instance from "../instance";

export const getApplicatorProfile = async ():Promise<IApplicator> => {
  const response = await instance.get("applicator/auth/profile");
  return response.data;
};

export const requestOTPToken = async (telephone: string) => {
  const response = await baseApi.post("applicator/auth/generate-otp", {
    telephone: telephone,
  });
  return response.data;
};

export const verifyOTPToken = async (telephone: string, token: string):Promise<IApplicatorResponse> => {
try {
    const response = await baseApi.post("applicator/auth/verify-otp", {
        telephone,
        token,
      });
      return response.data;
} catch (error:any) {
   throw new Error(error.response.data.message);
}
};
