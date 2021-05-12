import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { PaymentIntent, StripeCardElementChangeEvent } from '@stripe/stripe-js'
import { ShoppingCart, ErrorOutline } from '@styled-icons/material-outlined'

import Button from 'components/Button'
import Heading from 'components/Heading'
import { FormLoading } from 'components/Form'

import * as S from './styles'
import { useCart } from 'hooks/use-cart'
import { createPayment, createPaymentIntent } from 'utils/stripe/methods'
import { Session } from 'next-auth/client'

type PaymentFormProps = {
  session: Session
}

const PaymentForm = ({ session }: PaymentFormProps) => {
  const { push } = useRouter()
  const { items } = useCart()
  const stripe = useStripe()
  const elements = useElements()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const [freeGames, setFreeGames] = useState(false)

  useEffect(() => {
    async function setPaymentMode() {
      if (items.length) {
        setFreeGames(false)
        //bater na API /orders/create-payment-intent
        //enviar os items do carrinho
        const data = await createPaymentIntent({ items, token: session.jwt })
        //se receber freeGames true seto setFreeGames - fluxo de jogo gratuido
        if (data.freeGames) {
          setFreeGames(true)
          return
        }

        if (data.error) {
          setError(data.error)
          return
        }

        setClientSecret(data.client_secret)
      }
    }

    setPaymentMode()
  }, [items, session])

  const handleChange = async (event: StripeCardElementChangeEvent) => {
    setError(event.error ? event.error.message : '')
    setDisabled(event.empty)
  }

  const saveOrder = async (paymentIntent?: PaymentIntent) => {
    const data = await createPayment({
      items,
      paymentIntent,
      token: session.jwt
    })

    return data
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    //se freeGames
    if (freeGames) {
      //salva no banco
      //bater na API /orders
      saveOrder()
      //redireciona p/ success
      push('/success')
      return
    }

    const payload = await stripe!.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements!.getElement(CardElement)!
      }
    })

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`)
      setLoading(false)
    } else {
      setError(null)
      setLoading(false)

      //salvar a compra no banco do Strapi
      //bater na API /orders
      saveOrder(payload.paymentIntent)
      //redirecionar p/ pagina de sucesso!
      push('/success')
    }
  }

  return (
    <S.Wrapper>
      <form onSubmit={handleSubmit}>
        <S.Body>
          <Heading color="black" size="small" lineBottom>
            Payment
          </Heading>

          {freeGames ? (
            <S.FreeGames>Only free games, click buy and enjoy!</S.FreeGames>
          ) : (
            <CardElement
              options={{
                hidePostalCode: true,
                style: { base: { fontSize: '16px' } }
              }}
              onChange={handleChange}
            />
          )}

          {error && (
            <S.Error>
              <ErrorOutline size={20} />
              {error}
            </S.Error>
          )}
        </S.Body>
        <S.Footer>
          <Link href="/" passHref>
            <Button as="a" fullWidth minimal>
              Continue shopping
            </Button>
          </Link>
          <Button
            fullWidth
            icon={loading ? <FormLoading /> : <ShoppingCart />}
            disabled={!freeGames && (disabled || !!error)}
          >
            {!loading && <span>Buy now</span>}
          </Button>
        </S.Footer>
      </form>
    </S.Wrapper>
  )
}

export default PaymentForm
