import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from 'utils/tests/helpers'

import UserDropdown from '.'

describe('<UserDropdown />', () => {
  it('should render the username', () => {
    renderWithTheme(<UserDropdown username="Claudio" />)

    expect(screen.getByText(/claudio/i)).toBeInTheDocument()
  })

  it('Should render the menu', () => {
    renderWithTheme(<UserDropdown username="Claudio" />)

    userEvent.click(screen.getByText(/claudio/i))

    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /wishlist/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign out/i })).toBeInTheDocument()
  })
})
