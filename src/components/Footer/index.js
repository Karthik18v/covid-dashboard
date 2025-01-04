import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footer-container">
    <h1>
      Covid<span>India</span>
    </h1>
    <p>we stand with everyone fighting on the front lines</p>
    <div className="icons-container">
      <VscGithubAlt fontSize="48" color="#CBD5E1" />
      <FiInstagram fontSize="48" color="#CBD5E1" />
      <FaTwitter fontSize="48" color="#CBD5E1" />
    </div>
  </div>
)

export default Footer
