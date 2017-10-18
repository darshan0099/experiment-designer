import { connect } from 'react-redux'

import { chopTime } from '../../actions'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import InputField from 'components/timechop/input-field'
import Cut from 'material-ui/svg-icons/content/content-cut'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '75%'
}

const cardStyle = {
  margin: 20,
  width: '40%'
}

const cardHeaderStyle = {
  backgroundColor: '#BBBBBB'
}

const buttonStyle = {
  margin: 12
}

function mapStateToProps(state) {
  return {
    timechopData: state.app.timeChopData,
    matricesLoading: state.app.timechopMatrices.loading === true,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    chopThyme: (timechopData) => {
      dispatch(chopTime(timechopData))
    },
  }
}

const InputForm = (props) => {
  const chop = () => props.chopThyme(props.timechopData)

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title="Time Ranges" />
        <InputField
          prettyName="Feature Start Time"
          variableName="featureStartTime"
          description="Data aggregated into features begins at this point" />
        <br />
        <InputField
          prettyName="Feature End Time"
          variableName="featureEndTime"
          description="Data aggregated into features is from before this point" />
        <br />
        <InputField
          prettyName="Label Start Time"
          variableName="labelStartTime"
          description="Data aggregated into labels begins at this point" />
        <br />
        <InputField
          prettyName="Label End Time"
          variableName="labelEndTime"
          description="Data aggregated into labels is from before this point" />
        <br />
      </Card>
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title="Training" />
        <InputField
          prettyName="Model Update Frequency"
          variableName="modelUpdateFrequency"
          description="Amount of time between train/test splits" />
        <br />
        <InputField
          prettyName="Training Data Frequencies"
          variableName="trainingDataFrequencies"
          description="How much time between rows for a single entity in a training matrix" />
        <br />
        <InputField
          prettyName="Max Training Histories"
          variableName="maxTrainingHistories"
          description="The maximum amount of history for each entity to train on (early matrices may contain less than this time if it goes past label/feature start times)" />
        <br />
        <InputField
          prettyName="Training Prediction Spans"
          variableName="trainingPredictionSpans"
          description="How much time is covered by training labels (e.g., outcomes in the next 1 year? 3 days? 2 months?)" />
      </Card>
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title="Testing" />
        <InputField
          prettyName="Test Data Frequencies"
          variableName="testDataFrequencies"
          description="How much time between rows for a single entity in a test matrix" />
        <br />
        <InputField
          prettyName="Test Spans"
          variableName="testSpans"
          description="How far into the future should a model be used to make predictions" />
        <br />
        <InputField
          prettyName="Test Prediction Spans"
          variableName="testPredictionSpans"
          description="How much time is covered by test predictions (e.g., outcomes in the next 1 year? 3 days? 2 months?)" />
      </Card>
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title="Timechop UI" />
        <CardText>
          <div>Enter Timechop configuration values on the left, and press 'CHOP!' below to calculate splits. The splits will appear in a table below.</div>
          <br />
          <div>To pass multiple values, separate by comma.</div>
          <br />
          <div>All dates YYYY-MM-DD format.</div>
          <br />
          <div>All timespans will take Postgres-compatible forms (e.g. '1month', '1months')</div>
        </CardText>
        {props.matricesLoading ? (<CircularProgress />) : (<RaisedButton icon={<Cut />} style={buttonStyle} label="CHOP!" onClick={chop} />)}
      </Card>
    </div>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(InputForm)
