import { ITheme } from './emotion/types';
import defaultTheme from './emotion/defaultTheme';
import colors from './emotion/colors';
import fonts from './emotion/fonts';

export type ThemeType = ITheme;
export { defaultTheme as theme, fonts, colors };
