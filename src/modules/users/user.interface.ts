export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "contributor" | "viewer";
  isVerified: boolean;
  forgotPasswordToken: string,
  forgotPasswordTokenExpiry: Date,
  verifyToken: string,
  verifyTokenExpiry: Date
};
