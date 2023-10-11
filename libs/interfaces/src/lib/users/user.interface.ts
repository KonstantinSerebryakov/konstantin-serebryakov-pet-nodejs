export interface IUser {
	id?: string;
	email: string;
  isVerified: boolean;
	passwordHash: string;
	// role: UserRole;
}
