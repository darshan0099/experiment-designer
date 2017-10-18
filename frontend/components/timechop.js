import React from 'react'
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux'
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import More from 'material-ui/svg-icons/notification/more';
import Cut from 'material-ui/svg-icons/content/content-cut'
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { updateTimechopValue, chopTime, updateDialogText } from '../actions';
import { curry, addIndex, map, head, last } from 'ramda'
import moment from 'moment'
import ramda from 'ramda'

const mapIndexed = ramda.addIndex(ramda.map)

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

const inputStyle = {
  marginLeft: 10
}

const buttonStyle = {
  margin: 12
}

const dividerStyle = {
  marginLeft: 25,
  marginRight: 25
}

const helperStyle = {
  marginLeft: 10,
  fontSize: 12,
  color: 'rgba(0, 0, 0, 0.5)',
}

const errorStyle = {
  margin: 20,
  color: '#FF0000'
}

const noteStyle = {
  fontSize: 12
}

function mapStateToProps(state) {
  return {
    timechopData: state.app.timeChopData,
    matrices: state.app.timechopMatrices.data || [],
    matricesLoading: state.app.timechopMatrices.loading === true,
    presentError: state.app.timechopMatrices.error,
    showDialog: state.app.currentDialog !== '',
    dialogText: state.app.currentDialog
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateFieldValue: (field, event, newValue) => {
      dispatch(updateTimechopValue(field, newValue))
    },
    chopThyme: (timechopData) => {
      dispatch(chopTime(timechopData))
    },
    updateDialog: (dialogText, event) => {
      dispatch(updateDialogText(dialogText))
    }
  }
}
const Timechop = (props) => {
  const chop = (event) => props.chopThyme(props.timechopData)

  const showFullData = (row, rowNumber, event) => {
    props.updateDialog(JSON.stringify(row, null, '\t'))
  }

  const hideFullData = (event) => {
    props.updateDialog('')
  }

  const renderDialog = () => {
    return (<Dialog autoScrollBodyContent={true} open={props.showDialog} onRequestClose={hideFullData}><pre>{props.dialogText}</pre></Dialog>)
  }
  const renderSplit = (row, rowNumber) => {

    return (
      <TableRow key={rowNumber}>
        <TableRowColumn>{rowNumber}</TableRowColumn>
        <TableRowColumn>{moment(head(row.train_matrix.as_of_times.sort())).format('YYYY-MM-DD')}</TableRowColumn>
        <TableRowColumn>{moment(last(row.train_matrix.as_of_times.sort())).format('YYYY-MM-DD')}</TableRowColumn>
        <TableRowColumn>{moment(row.train_matrix.matrix_start_time).format('YYYY-MM-DD')} to {moment(row.train_matrix.matrix_end_time).format('YYYY-MM-DD')}</TableRowColumn>
        <TableRowColumn>{moment(row.test_matrices[0].matrix_start_time).format('YYYY-MM-DD')} to {moment(row.test_matrices[0].matrix_end_time).format('YYYY-MM-DD')}</TableRowColumn>
        <TableRowColumn><FloatingActionButton onClick={curry(showFullData)(row, rowNumber)}><ContentAdd /></FloatingActionButton></TableRowColumn>
        {renderDialog()}
      </TableRow>
    )
  }

  const renderTable = () => {
      return (<Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Split #</TableHeaderColumn>
            <TableHeaderColumn>First Train As Of Date</TableHeaderColumn>
            <TableHeaderColumn>Last Train As Of Date</TableHeaderColumn>
            <TableHeaderColumn>Train Range</TableHeaderColumn>
            <TableHeaderColumn>First Test Range</TableHeaderColumn>
            <TableHeaderColumn>Full Split Definition</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows={true} showRowHover={true}>
          {mapIndexed(renderSplit, props.matrices)}
        </TableBody>
      </Table>)
  }
  return (
    <div>
      <div style={containerStyle}>
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title="Time Ranges" />
        <TextField
          style={inputStyle}
          floatingLabelText="Feature Start Time"
          onChange={curry(props.updateFieldValue)('featureStartTime')}
          defaultValue={props.timechopData.featureStartTime}
        />
        <div style={helperStyle}>Data aggregated into features begins at this point</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Feature End Time"
          onChange={curry(props.updateFieldValue)('featureEndTime')}
          defaultValue={props.timechopData.featureEndTime}
        />
        <div style={helperStyle}>Data aggregated into features is from before this point</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Label Start Time"
          onChange={curry(props.updateFieldValue)('labelStartTime')}
          defaultValue={props.timechopData.labelStartTime}
        />
        <div style={helperStyle}>Data aggregated into labels begins at this point</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Label End Time"
          onChange={curry(props.updateFieldValue)('labelEndTime')}
          defaultValue={props.timechopData.labelEndTime}
        />
        <div style={helperStyle}>Data aggregated into labels is from before this point</div>
      </Card>
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title="Training" />
        <TextField
          style={inputStyle}
          floatingLabelText="Model Update Frequency"
          onChange={curry(props.updateFieldValue)('modelUpdateFrequency')}
          defaultValue={props.timechopData.modelUpdateFrequency}
        />
        <div style={helperStyle}>Amount of time between train/test splits</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Training Data Frequencies"
          onChange={curry(props.updateFieldValue)('trainingDataFrequencies')}
          defaultValue={props.timechopData.trainingDataFrequencies}
        />
        <div style={helperStyle}>How much time between rows for a single entity in a training matrix</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Max Training Histories"
          onChange={curry(props.updateFieldValue)('maxTrainingHistories')}
          defaultValue={props.timechopData.maxTrainingHistories}
        />
        <div style={helperStyle}>The maximum amount of history for each entity to train on (early matrices may contain less than this time if it goes past label/feature start times)</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Training Prediction Spans"
          onChange={curry(props.updateFieldValue)('trainingPredictionSpans')}
          defaultValue={props.timechopData.trainingPredictionSpans}
        />
        <div style={helperStyle}>How much time is covered by training labels (e.g., outcomes in the next 1 year? 3 days? 2 months?)</div>
      </Card>
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle} title="Testing" />
        <TextField
          style={inputStyle}
          floatingLabelText="Test Data Frequencies"
          onChange={curry(props.updateFieldValue)('testDataFrequencies')}
          defaultValue={props.timechopData.testDataFrequencies}
        />
        <div style={helperStyle}>How much time between rows for a single entity in a test matrix</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Test Spans"
          onChange={curry(props.updateFieldValue)('testSpans')}
          defaultValue={props.timechopData.testSpans}
        />
        <div style={helperStyle}>How far into the future should a model be used to make predictions</div>
        <br />
        <TextField
          style={inputStyle}
          floatingLabelText="Test Prediction Spans"
          onChange={curry(props.updateFieldValue)('testPredictionSpans')}
          defaultValue={props.timechopData.testPredictionSpans}
        />
        <div style={helperStyle}>How much time is covered by test predictions (e.g., outcomes in the next 1 year? 3 days? 2 months?)</div>
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
          {props.matricesLoading ? (<CircularProgress />) : (<RaisedButton icon={<Cut />} style={buttonStyle} label="CHOP!" onClick={chop}></RaisedButton>)}
      </Card>
    </div>
    <div style={errorStyle}>{props.presentError}</div>
    <div>
      {props.matricesLoading ? (<CircularProgress />) : renderTable()}
    </div>
  </div>)
}
export default connect(mapStateToProps, mapDispatchToProps)(Timechop)
