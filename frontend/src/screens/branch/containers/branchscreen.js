import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchBranches, selectBranch } from '../../../actions/branches'
import { changeConnectionStatus } from '../../../actions/connectionstatus'
import BranchScreenLayout from '../components/branchscreen'
import { 
    NetInfo,
    Text 
} from 'react-native'

class BranchScreen extends Component {
    onChangePicker = (itemValue, itemPosition) => {
        console.log(`Branch id selected: ${itemValue}`)
        this.props.dispatch(selectBranch(itemValue))
    }

    pressNextButton = () => {
        console.log(`Redirecting to Questions view...`)
        if(this.props.selectedBranch != 0) {
            // remove event listener
            NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
            this.props.navigation.navigate('Questions')
        }
    }

    handleConnectionChange = isConnected => {
        console.log(`INGRESA AL CALLBACK BRANCHES ------------------`)
        this.props.dispatch(changeConnectionStatus(isConnected))
        // if connected, try to fetch branches
        if(this.props.isConnected)
            this.props.dispatch(fetchBranches())
    }

    componentDidMount() {
        // verify internet connection status
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange)
    }

    render() {
        if(this.props.loading)
            return (
                <Text>Cargando ...</Text>
            )
        return (
            <BranchScreenLayout 
                branches={this.props.branches}
                selectedBranch={this.props.selectedBranch}
                onChangePicker={this.onChangePicker}
                pressNextButton={this.pressNextButton}
            />
        )
    }
}

function mapStateToProps(state, props) {
    console.log(`[State from Branch]: ${JSON.stringify(state)}`)
    return {
        branches: state.branches.items,
        selectedBranch: state.branches.selectedItem,
        loading: state.branches.loading,
        isConnected: state.connectionstatus.isConnected,
    }
}

export default connect(mapStateToProps)(BranchScreen)
