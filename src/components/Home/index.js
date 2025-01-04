import React from 'react'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header/index'
import Footer from '../Footer/index'
import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends React.Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    stateInfo: [],
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    this.getStateWiseData()
  }

  getStateWiseData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      let nationalWideConfirmedCases = 0
      let nationalWideRecoveredCases = 0
      let nationalWideDeceasedCases = 0
      let nationalWideActiveCases = 0

      statesList.forEach(state => {
        if (data[state.state_code]) {
          const {total} = data[state.state_code]
          nationalWideConfirmedCases += total.confirmed ? total.confirmed : 0
          nationalWideDeceasedCases += total.deceased ? total.deceased : 0
          nationalWideRecoveredCases += total.recovered ? total.recovered : 0
        }
      })
      nationalWideActiveCases +=
        nationalWideConfirmedCases -
        (nationalWideRecoveredCases + nationalWideDeceasedCases)

      const states = statesList.map(eachState => ({
        stateName: eachState.state_name,
        stateCode: eachState.state_code,
        confirmed: Object.keys(data)
          .filter(state => state === eachState.state_code)
          .map(e => data[e].total.confirmed),
        recovered: Object.keys(data)
          .filter(state => state === eachState.state_code)
          .map(e => data[e].total.recovered),
        deceased: Object.keys(data)
          .filter(state => state === eachState.state_code)
          .map(e => data[e].total.deceased),
        population: Object.keys(data)
          .filter(state => state === eachState.state_code)
          .map(e => data[e].meta.population),
      }))
      console.log(states)
      this.setState({
        stateInfo: states,
        totalActiveCases: nationalWideActiveCases,
        totalRecoveredCases: nationalWideRecoveredCases,
        totalDeceasedCases: nationalWideDeceasedCases,
        totalConfirmedCases: nationalWideConfirmedCases,
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

  renderAllNationalData = () => {
    const {
      totalConfirmedCases,
      totalActiveCases,
      totalRecoveredCases,
      totalDeceasedCases,
    } = this.state

    return (
      <div className="stats-container">
        <div testid="countryWideConfirmedCases" className="stats-block-column">
          <p className="stats-title red">Confirmed</p>
          <img
            src="https://res.cloudinary.com/amst/image/upload/v1639929248/conf_cof3e9.jpg"
            className="stats-icon"
            alt="country wide confirmed cases pic"
          />
          <p className="stats-number red">{totalConfirmedCases}</p>
        </div>

        <div testid="countryWideActiveCases" className="stats-block-column">
          <p className="stats-title blue">Active</p>
          <img
            src="https://res.cloudinary.com/amst/image/upload/v1639929248/act_kq7nfx.jpg"
            className="stats-icon"
            alt="country wide active cases pic"
          />
          <p className="stats-number blue">{totalActiveCases}</p>
        </div>

        <div testid="countryWideRecoveredCases" className="stats-block-column">
          <p className="stats-title green">Recovered</p>
          <img
            src="https://res.cloudinary.com/amst/image/upload/v1639929248/uyf_ndpqov.jpg"
            className="stats-icon"
            alt="country wide recovered cases pic"
          />
          <p className="stats-number green">{totalRecoveredCases}</p>
        </div>

        <div testid="countryWideDeceasedCases" className="stats-block-column ">
          <p className="stats-title gray">Deceased</p>
          <img
            src="https://res.cloudinary.com/amst/image/upload/v1639929248/dese_tgak4e.jpg"
            className="stats-icon"
            alt="country wide deceased cases pic"
          />
          <p className="stats-number gray">{totalDeceasedCases}</p>
        </div>
      </div>
    )
  }

  renderAllStateStats = () => {
    const {stateInfo} = this.state
    console.log(stateInfo)
    return (
      <div className="state-info-container">
        <div className="state-info-heading">
          <p className="state-heading state">States/UT</p>
          <p className="state-heading">Confirmed</p>
          <p className="state-heading">Active</p>
          <p className="state-heading">Recovered</p>
          <p className="state-heading">Deceased</p>
          <p className="state-heading">Population</p>
        </div>
        <hr />
        {stateInfo.map(eachState => (
          <div className="state-info-item">
            <Link
              to={`/state/${eachState.stateCode}`}
              className="state-info-state-name"
            >
              <p className="states-names-home">{eachState.stateName}</p>
            </Link>
            <p className="state-info-stats red">{eachState.confirmed}</p>
            <p className="state-info-stats blue">
              {eachState.confirmed - eachState.recovered}
            </p>
            <p className="state-info-stats green">{eachState.recovered}</p>
            <p className="state-info-stats gray">{eachState.deceased}</p>
            <p className="state-info-stats gray">{eachState.population}</p>
          </div>
        ))}
      </div>
    )
  }

  renderSuccessView = () => (
    <div className="main-container">
      <div className="search-container">
        <BsSearch size="26" color="#94A3B8" />
        <input className="search" type="search" placeholder="Enter States" />
      </div>
      {this.renderAllNationalData()}
      {this.renderAllStateStats()}
      <Footer />
    </div>
  )

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllViews()}
      </>
    )
  }
}

export default Home
