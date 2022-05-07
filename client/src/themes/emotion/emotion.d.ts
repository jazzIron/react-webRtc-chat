import '@emotion/react';
import { IColor } from './colors';
import { IFont } from './fonts';
import { ITheme } from './types';

declare module '@emotion/react' {
  interface Theme extends ITheme {}
}
