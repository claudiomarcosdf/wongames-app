import { render, screen } from 'utils/test-utils'
import userEvent from '@testing-library/user-event'

import UserDropdown from '.'

describe('<UserDropdown />', () => {
  it('should render the username', () => {
    render(<UserDropdown username="Claudio" />)

    expect(screen.getByText(/claudio/i)).toBeInTheDocument()
  })

  it('Should render the menu', () => {
    render(<UserDropdown username="Claudio" />)

    userEvent.click(screen.getByText(/claudio/i))

    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /wishlist/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument()
  })
})
