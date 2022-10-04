import { useRouter } from 'next/router';
import { getLayoutPerPathname } from './helpers';

export const Layout: React.FC<{ children: React.ReactElement }> = ({
  children,
}): JSX.Element => {
  const { pathname } = useRouter();
  const BaseLayout = getLayoutPerPathname(pathname);
  return <BaseLayout>{children}</BaseLayout>;
};
