import Home, { HomeTemplateProps } from 'templates/Home'

import { initializeApollo } from 'utils/apollo'
import { QueryHome, QueryHomeVariables } from 'graphql/generated/QueryHome'
import { QUERY_HOME } from 'graphql/queries/home'
import { bannerMapper, gamesMapper, highlightMapper } from 'utils/mappers'

//Lado do client
export default function Index(props: HomeTemplateProps) {
  return <Home {...props} />
}

//getStaticProps/ getServerSideProps só funcionam em PAGES
//getServerSideProps - gerar via ssr a cada request (nunca vai para o bundle do client)
//getInitialProps - gerar via ssr a cada request (vai para o client, faz hydrate do lado do client depois do primeiro request)

//Lado do server
export async function getStaticProps() {
  //Não usar/deixar undefined em staticprops

  const apolloClient = initializeApollo()
  const TODAY = new Date().toISOString().slice(0, 10)

  const {
    data: { banners, newGames, upcomingGames, freeGames, sections }
  } = await apolloClient.query<QueryHome, QueryHomeVariables>({
    query: QUERY_HOME,
    variables: { date: TODAY },
    fetchPolicy: 'no-cache' //Pega da API mas NÃO guarda no cache
  })

  return {
    revalidate: 10, //ISR - Incremental Static Regeneration
    props: {
      banners: bannerMapper(banners),
      newGamesTitle: sections?.newGames?.title,
      newsGames: gamesMapper(newGames),
      mostPopularGamesTitle: sections?.popularGames?.title,
      mostPopularHighlight: highlightMapper(sections?.popularGames?.highlight),
      mostPopularGames: gamesMapper(sections!.popularGames!.games),
      upcomingGamesTitle: sections?.upcomingGames?.title,
      upcomingGames: gamesMapper(upcomingGames),
      upcomingHighlight: highlightMapper(sections?.upcomingGames?.highlight),
      freeGamesTitle: sections?.freeGames?.title,
      freeGames: gamesMapper(freeGames),
      freeHighlight: highlightMapper(sections?.freeGames?.highlight)
    }
  }
}
