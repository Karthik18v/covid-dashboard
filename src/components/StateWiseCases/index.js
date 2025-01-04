import {Component} from 'react'
import Header from '../Header'
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

class StateWiseCases extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    totalTested: 0,
    totalConfirmed: 0,
    totalDeceased: 0,
    totalRecovered: 0,
    districtsData: [],
    stateName: '',
    activeTab: 'Confirmed',
    topDistrics: [],
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    this.getStateDetails()
  }

  getStateDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const name = statesList.find(each => each.state_code === stateCode)
      .state_name

    const apiUrl = `https://apis.ccbp.in/covid19-state-wise-data/`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const {total} = data[stateCode]
      const {tested, confirmed, recovered, deceased} = total
      const districtData = data[stateCode].districts
      const districtName = Object.keys(districtData)
      const districtWiseData = districtName.map(eachDistrict => ({
        districtName: eachDistrict,
        totalConfirmed: districtData[eachDistrict].total.confirmed || 0,
        totalDeceased: districtData[eachDistrict].total.deceased || 0,
        totalRecovered: districtData[eachDistrict].total.recovered || 0,
        totalActive:
          districtData[eachDistrict].total.confirmed -
            (districtData[eachDistrict].total.deceased +
              districtData[eachDistrict].total.deceased) || 0,
      }))
      this.setState({
        districtsData: districtWiseData,
        totalTested: tested,
        totalConfirmed: confirmed,
        totalDeceased: deceased,
        totalRecovered: recovered,
        stateName: name,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderTopDistricts = () => {
    const {districtsData, activeTab} = this.state
    let categoryWise
    if (activeTab === 'Confirmed') {
      categoryWise = districtsData.sort(
        (a, b) => b.totalConfirmed - a.totalConfirmed,
      )
    } else if (activeTab === 'Active') {
      categoryWise = districtsData.sort((a, b) => b.totalActive - a.totalActive)
    } else if (activeTab === 'Recovered') {
      categoryWise = districtsData.sort(
        (a, b) => b.totalRecovered - a.totalRecovered,
      )
    } else {
      categoryWise = districtsData.sort(
        (a, b) => b.totalDeceased - a.totalDeceased,
      )
    }

    console.log(categoryWise)

    return (
      <>
        <h1 className="top-heading">Top Districts</h1>
        <div className="top-districts">
          {categoryWise.map(each => (
            <div className="district">
              <p>{each.totalConfirmed}</p>
              <p>{each.districtName}</p>
            </div>
          ))}
        </div>
      </>
    )
  }

  onChangeTab = active => {
    this.setState({activeTab: active})
  }

  render() {
    const {
      totalConfirmed,
      totalTested,
      totalRecovered,
      totalDeceased,
      districtsData,
      stateName,
      activeTab,
    } = this.state
    console.log(districtsData)
    return (
      <>
        <Header />
        <div className="state-container">
          <div className="state-container-header">
            <div>
              <h2>{stateName}</h2>
              <p>Last updated on march 28th 2021</p>
            </div>
            <div>
              <p>Tested</p>
              <p>{totalTested}</p>
            </div>
          </div>
          <div className="state-stats">
            <button
              type="button"
              className="button"
              onClick={() => this.onChangeTab('Confirmed')}
            >
              <div
                testid="countryWideConfirmedCases"
                className={
                  activeTab === 'Confirmed'
                    ? 'stats-block-column active-red'
                    : 'stats-block-column'
                }
              >
                <p className="stats-title red">Confirmed</p>
                <img
                  src="https://i.imghippo.com/files/pLog6952WMM.png"
                  className="stats-icon"
                  alt="country wide confirmed cases pic"
                />
                <p className="stats-number red">{totalConfirmed}</p>
              </div>
            </button>
            <button
              type="button"
              className="button"
              onClick={() => this.onChangeTab('Active')}
            >
              <div
                testid="countryWideActiveCases"
                className={
                  activeTab === 'Active'
                    ? 'stats-block-column active-blue'
                    : 'stats-block-column'
                }
              >
                <p className="stats-title blue">Active</p>
                <img
                  src="https://i.imghippo.com/files/jWT7726Orw.png"
                  className="stats-icon"
                  alt="country wide active cases pic"
                />
                <p className="stats-number blue">
                  {totalConfirmed - totalDeceased - totalRecovered}
                </p>
              </div>
            </button>
            <button
              type="button"
              className="button"
              onClick={() => this.onChangeTab('Recovered')}
            >
              <div
                testid="countryWideRecoveredCases"
                className={
                  activeTab === 'Recovered'
                    ? 'stats-block-column active-blue'
                    : 'stats-block-column'
                }
              >
                <p className="stats-title green">Recovered</p>
                <img
                  src="https://i.imghippo.com/files/oTR1177jE.png"
                  className="stats-icon"
                  alt="country wide recovered cases pic"
                />
                <p className="stats-number green">{totalRecovered}</p>
              </div>
            </button>
            <button
              type="button"
              className="button"
              onClick={() => this.onChangeTab('Deceased')}
            >
              <div
                testid="countryWideDeceasedCases"
                className={
                  activeTab === 'Deceased'
                    ? 'stats-block-column active-blue'
                    : 'stats-block-column'
                }
              >
                <p className="stats-title gray">Deceased</p>
                <img
                  src="https://res.cloudinary.com/amst/image/upload/v1639929248/dese_tgak4e.jpg"
                  className="stats-icon"
                  alt="country wide deceased cases pic"
                />
                <p className="stats-number gray">{totalDeceased}</p>
              </div>
            </button>
          </div>
          {this.renderTopDistricts()}
        </div>
      </>
    )
  }
}

export default StateWiseCases
