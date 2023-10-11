import { IAvatar } from "./avatar.interface";
import { ICredential } from "./credential.interface";
import { ISocialMedias } from "./social-medias.interface";

// export type ProfileDefaults = Omit<IProfile, 'skills'>

export interface IProfile {
	id?: string;
  userId: string;
  isDefault?: boolean;
  socialMediaNodes?: ISocialMedias;
  credential?: ICredential | null;
}
