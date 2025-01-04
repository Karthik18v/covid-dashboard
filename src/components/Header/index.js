import {Link} from 'react-router-dom'
import './index.css'

const Header = () => (
  <div className="header">
    <h1>
      <Link className="link" to="/">
        Covid<span>India</span>
      </Link>
    </h1>

    <ul className="header-items">
      <li>
        <Link className="link" to="/">
          Home
        </Link>
      </li>
      <li>
        <Link className="link" to="/about">
          About
        </Link>
      </li>
    </ul>
  </div>
)

export default Header
