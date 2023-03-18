export interface UpdateUserDto {
  uid: string;
  name?: string;
  description?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  pinterest_link?: string;
  telegram_link?: string;
  cover_path?: string;
  avatars?: {
    defaultImage: string;
    small: string;
    middle: string;
    large: string;
  };
}
