import { TokenTypesEnum } from '../../../constants/token/token.constant';

export interface ResendTokenDto {
  type: TokenTypesEnum;
  email: string;
}
