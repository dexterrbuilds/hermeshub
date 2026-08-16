export type AuthUser = {
  id: string;
  email?: string;
  role?: string;
};

export type RequestWithUser = Request & {
  user: AuthUser;
};
