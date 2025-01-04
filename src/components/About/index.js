import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header/index'

import './index.css'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class About extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    faqData: [],
    factsData: [],
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    this.getFaqDetails()
  }

  getFaqDetails = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-faqs'
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)

      const updateFactoidsData = data.factoids.map(each => ({
        banner: each.banner,
        id: each.id,
      }))
      const updateFaqsData = data.faq.map(each => ({
        answer: each.answer,
        category: each.category,
        qno: each.qno,
        question: each.question,
      }))
      this.setState({
        faqData: updateFaqsData,
        factsData: updateFactoidsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div testid="homeRouteLoader" className="products-loader-container">
      <Loader type="ThreeDots" color="white" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {factsData, faqData} = this.state
    return (
      <div className="about-content-container">
        <h1>About</h1>
        <p className="about-description">Last update on December 25th 2021.</p>
        <p className="about-vaccine-title">
          COVID-19 vaccines be ready for distribution
        </p>
        <ul testid="faqsUnorderedList" className="fact-list">
          {faqData.map(eachFaq => (
            <li key={eachFaq.no}>
              <p className="question">{eachFaq.question}</p>
              <p className="answer">{eachFaq.answer}</p>
            </li>
          ))}
        </ul>
        <h1>Facts</h1>
        <ul className="fact-list">
          {factsData.map(each => (
            <li>
              <p>{each.banner}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="about-container">
        <Header />
        {this.renderAllViews()}
        <Footer />
      </div>
    )
  }
}

export default About
