import DisputeDetail from './dispute-detail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'
import web3 from '../ethereum/web3'

class Dispute extends React.Component {
  constructor(props) {
    super(props)
    console.log('DISPUTE PROPS')
    console.log(props)
    this.state = {
      reload: false
    }
  }

  disputeStatusToString = code => {
    switch (code) {
      case '0':
        return 'Waiting'
      case '1':
        return 'Appealable'
      case '2':
        return 'Solved'

      default:
        return `${code}`
    }
  }

  apiPrefix = networkType => {
    switch (networkType) {
      case 'main':
        return ' '
      case 'kovan':
        return 'kovan.'
      default:
        return ' '
    }
  }

  render() {
    const {
      activeWallet,
      arbitrated,
      centralizedArbitratorInstance,
      evidences,
      fee,
      id,
      ipfsGateway,
      metaevidence,
      networkType,
      status
    } = this.props
    return (
      <React.Fragment>
        <tbody>
          <tr
            aria-controls={`accordion${id}`}
            aria-expanded="false"
            className="clickable"
            data-target={`#accordion${id}`}
            data-toggle="collapse"
          >
            <td>{id}</td>
            <td>
              <a
                href={`https://${this.apiPrefix(
                  networkType
                )}etherscan.io/address/${arbitrated}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {`${arbitrated.substring(0, 8)}...`}
              </a>
            </td>
            <td>
              {parseFloat(web3.utils.fromWei(fee, 'ether')).toExponential()}
            </td>
            <td className="primary-inverted">
              <b>{this.disputeStatusToString(status)}</b>
            </td>
            <td>
              <FontAwesomeIcon icon="caret-down" />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="collapse" id={`accordion${id}`}>
                <DisputeDetail
                  archon={this.props.archon}
                  activeWallet={activeWallet}
                  aliases={metaevidence && metaevidence.aliases}
                  category={metaevidence && metaevidence.category}
                  centralizedArbitratorInstance={centralizedArbitratorInstance}
                  description={metaevidence && metaevidence.description}
                  evidences={evidences}
                  fileHash={metaevidence && metaevidence.fileHash}
                  fileURI={metaevidence && metaevidence.fileURI}
                  id={id}
                  ipfsGateway={ipfsGateway}
                  question={metaevidence && metaevidence.question}
                  rulingOptions={metaevidence && metaevidence.rulingOptions}
                  title={metaevidence && metaevidence.title}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </React.Fragment>
    )
  }
}

Dispute.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  arbitrated: PropTypes.string.isRequired,
  centralizedArbitratorInstance: PropTypes.instanceOf(web3.eth.Contract)
    .isRequired,
  evidences: PropTypes.arrayOf(PropTypes.object).isRequired,
  fee: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  metaevidence: PropTypes.shape({
    aliases: PropTypes.shape({
      [PropTypes.string]: PropTypes.string
    }),
    category: PropTypes.string,
    description: PropTypes.string,
    fileHash: PropTypes.string,
    fileTypeExtension: PropTypes.string,
    fileURI: PropTypes.string,
    rulingOptions: PropTypes.shape({
      description: PropTypes.arrayOf(PropTypes.string).isRequired,
      titles: PropTypes.arrayOf(PropTypes.string).isRequired
    }),
    selfHash: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  networkType: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

export default Dispute
