export type ISocialMedias = Array<ISocialMediaNode>;

export interface ISocialMediaNode {
  id?: string;
  profileId?: string;

  socialMediaVariant: ISocialMediaVariant;
  isActive: boolean;
  link: string;
}

export interface ISocialMediaVariant {
  id?: number;
  iconUrl: string | null;
  name: string;
}
