import { MetaTags } from '../../MetaTags/MetaTags';

export const AppFlex: React.FC<{ children: React.ReactElement }> = ({
  children,
}): JSX.Element => {
  return (
    <>
      <MetaTags />
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
};
