import React from 'react'
import { connect } from 'react-redux'
import InputForm from 'components/timechop/input-form'
import SplitTable from 'components/timechop/split-table'
import CircularProgress from 'material-ui/CircularProgress'



const errorStyle = {
  margin: 20,
  color: '#FF0000'
}


function mapStateToProps(state) {
  return {
    matricesLoading: state.app.timechopMatrices.loading === true,
    presentError: state.app.timechopMatrices.error,
  }
}

function mapDispatchToProps() {
  return {}
}
const Timechop = (props) => {
  return (
    <div>
      <InputForm />
      <div style={errorStyle}>{props.presentError}</div>
      <div>
        {props.matricesLoading ? (<CircularProgress />) : <SplitTable />}
      </div>
    </div>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(Timechop)
