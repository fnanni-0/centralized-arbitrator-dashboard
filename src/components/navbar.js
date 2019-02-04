import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Identicon from './identicon.js'
import PropTypes from 'prop-types'
import React from 'react'
import NotificationItem from './notification-item'
import $ from 'jquery'
import web3 from '../ethereum/web3'

class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allName: '',
      allEmail: '',
      allDisputes: false,
      allEvidences: false,
      currentName: '',
      currentEmail: '',
      currentDisputes: false,
      currentEvidences: false
    }
  }

  componentDidMount(props) {
    console.log(props)

    $('.notification-control').on('click', () => {
      console.log(this.props)
      this.props.clearNotifications()
    })
  }

  clearNotifications() {
    this.props.clearNotifications()
  }

  componentDidUpdate() {}

  onSubscribe = (
    name,
    email,
    sendWhenNewDispute,
    sendWhenNewEvidence
  ) => async e => {
    console.log(e)
    const { wallet } = this.props
    const address = web3.utils.toChecksumAddress(wallet)
    const settings = {
      email: { S: email },
      fullName: { S: name },
      centralizedArbitratorDashboardNotificationSettingDisputes: {
        S: sendWhenNewDispute
      },
      centralizedArbitratorDashboardNotificationSettingEvidences: {
        S: sendWhenNewEvidence
      }
    }
    const signature = await web3.eth.personal.sign(
      JSON.stringify(settings),
      address
    )

    fetch(
      'https://hgyxlve79a.execute-api.us-east-2.amazonaws.com/production/user-settings',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: { address, settings, signature }
        })
      }
    )
  }

  onUnsubscribe = () => async e => {
    const { wallet } = this.props
    const address = web3.utils.toChecksumAddress(wallet)
    const settings = {
      centralizedArbitratorDashboardNotificationSettingDisputes: {
        S: false
      },
      centralizedArbitratorDashboardNotificationSettingEvidences: {
        S: false
      }
    }
    const signature = await web3.eth.personal.sign(
      JSON.stringify(settings),
      address
    )

    fetch(
      'https://hgyxlve79a.execute-api.us-east-2.amazonaws.com/production/user-settings',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: { address, settings, signature } })
      }
    )
  }

  onAllNameChange = e => {
    console.log(e)
    this.setState({ allName: e.target.value })
  }

  onAllEmailChange = e => {
    console.log(e)
    this.setState({ allEmail: e.target.value })
  }

  render() {
    const { wallet } = this.props
    const {
      allName,
      allEmail,
      allDisputes,
      allEvidences,
      currentName,
      currentEmail
    } = this.state

    return (
      <nav className="navbar navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="./">
          <span>
            <img
              alt=""
              className="d-inline-block align-mid"
              height="50px"
              src="kleros-logo-white.svg"
            />
          </span>
        </a>
        <button
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-target="#navbarNav"
          data-toggle="collapse"
          type="button"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto mb-1">
            <li className="nav-item active">
              <a className="nav-link " href="./">
                <small>Centralized Arbitrator Dashboard</small>
                <span className="sr-only">(current)</span>
              </a>
            </li>
          </ul>
          <div className="dropdown">
            <button
              aria-expanded="false"
              aria-haspopup="true"
              className="btn btn-secondary"
              data-toggle="dropdown"
              id="dropdownMenu2"
              type="button"
            >
              <FontAwesomeIcon className="navbar-icon" icon="bell" size="2x" />
            </button>
            <span className="badge badge-notify primary">
              {this.props.notifications.length}
            </span>
            <div
              aria-labelledby="dropdownMenu2"
              className="p-2 dropdown-menu dropdown-menu-right notification-control"
            >
              <div className="m-2 row">
                <div className="col text-center">
                  <label>
                    <b>Notifications</b>
                  </label>
                </div>
              </div>
              <hr />
              {this.props.notifications &&
                this.props.notifications.map(notification => (
                  <NotificationItem
                    key={notification.notification + notification.time}
                    text={notification.notification}
                    time={notification.time}
                  />
                ))}
              {this.props.notifications.length == 0 && (
                <div className="text-center">No New Notifications</div>
              )}
            </div>
          </div>
          <div className="mr-4 dropdown">
            <button
              aria-expanded="false"
              aria-haspopup="true"
              className="btn btn-secondary"
              data-toggle="dropdown"
              id="dropdownMenu2"
              type="button"
            >
              <FontAwesomeIcon
                className="navbar-icon"
                icon="envelope"
                size="2x"
              />
            </button>
            <div
              aria-labelledby="dropdownMenu2"
              className="p-4 dropdown-menu dropdown-menu-right email-notification-control"
            >
              <label className="col-md-12 text-center">
                Please contact{' '}
                <a href="mailto:contact@kleros.io">contact@kleros.io</a> for
                registering email notifications, providing your centralized
                arbitrator contract address.
              </label>
              <div className="tab-content" id="myTabContent">
                <div
                  aria-labelledby="all-contracts-tab"
                  className="tab-pane fade show active"
                  id="profile"
                  role="tabpanel"
                />
              </div>
            </div>
          </div>
          <div className="align-bottom mx-2 pt-2">
            <Identicon
              bgColor="#4004A3"
              className="identicon"
              color="#009AFF"
              scale={3}
              seed={wallet}
              size={10}
              spotColor="white"
            />
          </div>
        </div>
      </nav>
    )
  }
}

NavBar.propTypes = {
  wallet: PropTypes.string.isRequired
}

export default NavBar
