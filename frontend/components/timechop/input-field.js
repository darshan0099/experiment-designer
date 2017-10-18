import { connect } from 'react-redux'
import { updateTimechopValue } from '../../actions'
import { curry } from 'ramda'
import TextField from 'material-ui/TextField'

const inputStyle = {
  marginLeft: 10
}
const helperStyle = {
  marginLeft: 10,
  fontSize: 12,
  color: 'rgba(0, 0, 0, 0.5)',
}

function mapStateToProps(state) {
  return {
    timechopData: state.app.timeChopData,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updateFieldValue: (field, _, newValue) => {
      dispatch(updateTimechopValue(field, newValue))
    }
  }
}
const InputField = (props) => {
  return (
    <span>
      <TextField
        style={inputStyle}
        floatingLabelText={props.prettyName}
        onChange={curry(props.updateFieldValue)(props.variableName)}
        defaultValue={props.timechopData[props.variableName]} />
      <div style={helperStyle}>{props.description}</div>
    </span>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(InputField)
