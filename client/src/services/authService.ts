import api from "@/lib/api";
import axios from "axios";
import type { User } from "@/types";
import type { RegisterPayload } from "@/lib/validators";
import type { ProfileEditPayload } from "@/lib/validators";
import type { ChangePasswordPayload } from "@/lib/validators";
import { APP_MESSAGES } from "@/lib/constants/messages";

export const registerService = async (
 payload: RegisterPayload
): Promise<unknown> => {
 try {
 const response = await api.post("/citizens/register", payload);
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(
 error.response.data.error || APP_MESSAGES.AUTH.REGISTER_FAILED
 );
 }
 throw new Error(APP_MESSAGES.AUTH.REGISTER_UNKNOWN_ERROR);
 }
};

export const loginService = async (
 username: string,
 password: string
): Promise<unknown> => {
 try {
 const response = await api.post("/auth/unified-login", {
 username,
 password,
 });

 if (response.data.requires_otp) {
 return response.data; // { requires_otp: true, userType: '...', username: '...' }
 }

 const userData = response.data.user;

 if (userData.nik) {
 return {
 ...userData,
 userType: APP_MESSAGES.ROLES.CITIZEN as "masyarakat",
 };
 } else if (userData.id_petugas) {
 return {
 ...userData,
 userType: APP_MESSAGES.ROLES.OFFICER as "petugas",
 };
 }

 throw new Error(APP_MESSAGES.AUTH.INVALID_USER_DATA);
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(
 error.response.data.error || APP_MESSAGES.AUTH.LOGIN_FAILED
 );
 }
 throw new Error(APP_MESSAGES.AUTH.LOGIN_UNKNOWN_ERROR);
 }
};

export const verifyOtpService = async (
 username: string,
 otp_code: string,
 userType: string
): Promise<User> => {
 try {
 const response = await api.post("/auth/verify-otp", {
 username,
 otp_code,
 userType
 });
 
 const userData = response.data.user;
 
 if (userData.nik) {
 return { ...userData, userType: APP_MESSAGES.ROLES.CITIZEN as "masyarakat" };
 } else if (userData.id_petugas) {
 return { ...userData, userType: APP_MESSAGES.ROLES.OFFICER as "petugas" };
 }
 
 throw new Error(APP_MESSAGES.AUTH.INVALID_USER_DATA);
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(error.response.data.error || APP_MESSAGES.AUTH.OTP_VERIFY_FAILED);
 }
 throw new Error(APP_MESSAGES.AUTH.OTP_UNKNOWN_ERROR);
 }
};

export const getProfileService = async (): Promise<User | null> => {
 try {
 const response = await api.get("/auth/profile");
 const userData = response.data.user;

 if (!userData) return null;

 if (userData.nik) {
 return { ...userData, userType: APP_MESSAGES.ROLES.CITIZEN as "masyarakat" };
 }

 if (userData.id_petugas) {
 return { ...userData, userType: APP_MESSAGES.ROLES.OFFICER as "petugas" };
 }

 return null;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response?.status === 401) {
 // justification: 401 Unauthorized means the user's session has expired or they are not logged in. Returning null handles this expected auth state gracefully.
 return null;
 }
 void error;
 return null;
 }
};

export const changePasswordService = async (
 payload: Pick<ChangePasswordPayload, "old_password" | "new_password">
) => {
 try {
 const response = await api.post("/auth/change-password", payload);
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(error.response.data.error || APP_MESSAGES.AUTH.CHANGE_PASSWORD_FAILED);
 }
 throw new Error(APP_MESSAGES.AUTH.UNKNOWN_ERROR);
 }
};

export const updateProfileService = async (
 payload: Partial<ProfileEditPayload>
) => {
 try {
 const response = await api.patch("/auth/update-profile", payload);
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(error.response.data.error || APP_MESSAGES.AUTH.UPDATE_PROFILE_FAILED);
 }
 throw new Error(APP_MESSAGES.AUTH.UNKNOWN_ERROR);
 }
};
