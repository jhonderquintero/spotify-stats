import { AppFlex } from './App/AppFlex';
import { HomePageFlex } from './Homepage/HomePageFlex';

export const getLayoutPerPathname = (pathname: string) => {
  if (pathname === '/login') return HomePageFlex;
  else return AppFlex;
};
