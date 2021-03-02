import { useRouter } from 'next/router'
import { Container } from 'components/Container'
import Heading from 'components/Heading'
import ProfileMenu from 'components/ProfileMenu'
import React from 'react'
import Base from 'templates/Base'
import * as S from './styles'

export type ProfileTemplateProsps = {
  children: React.ReactNode
}

const Profile = ({ children }: ProfileTemplateProsps) => {
  const { asPath } = useRouter() //retorna a URL corrente

  return (
    <Base>
      <Container>
        <Heading lineLeft lineColor="secondary">
          My profile
        </Heading>

        <S.Main>
          <ProfileMenu activeLink={asPath} />

          <S.Content>{children}</S.Content>
        </S.Main>
      </Container>
    </Base>
  )
}

export default Profile
