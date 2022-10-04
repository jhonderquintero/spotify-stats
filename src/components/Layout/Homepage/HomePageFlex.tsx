import styled from 'styled-components';
import { MetaTags } from '../../MetaTags/MetaTags';
import img from '../../../../public/assets/images/spotify-home.png';

export const HomepageContainer = styled.div`
  background-image: url(${img.src});
  width: 100vw;
  height: 100vh;
  color: white;
`;

export const HomePageFlex: React.FC<{ children: React.ReactElement }> = ({
  children,
}): JSX.Element => {
  return (
    <>
      <MetaTags />
      <main>
        <HomepageContainer>{children}</HomepageContainer>
      </main>
    </>
  );
};
