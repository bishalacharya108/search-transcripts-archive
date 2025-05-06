export type TUser = {
  userName: string;
  email: string;
  password: string;
  role: "admin" | "contributor" | "viewer";
  isVerified: boolean;
  forgotPasswordToken: string,
  forgotPasswordTokenExpiry: Date,
  verifyToken: string,
  verifyTokenExpiry: Date
};
