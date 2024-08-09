import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import { Button } from "./ui/button"

const Navbar = () => {
  return (
    <nav className="w-full p-6 fixed top-0 flex justify-between items-center">
      <Logo />
      <div className="flex items-center gap-x-2">
        <Button>Login</Button>
        <Button>Sign Up</Button>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar