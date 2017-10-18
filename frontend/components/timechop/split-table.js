import React from 'react'
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { updateDialogText } from '../../actions'
import { curry, addIndex, map, head, last } from 'ramda'
import moment from 'moment'

const mapIndexed = addIndex(map)


function mapStateToProps(state) {
  return {
    matrices: state.app.timechopMatrices.data || [],
    matricesLoading: state.app.timechopMatrices.loading === true,
    presentError: state.app.timechopMatrices.error,
    showDialog: state.app.currentDialog !== '',
    dialogText: state.app.currentDialog
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateDialog: (dialogText) => {
      dispatch(updateDialogText(dialogText))
    }
  }
}
const SplitTable = (props) => {
  const showFullData = (row, _) => {
    props.updateDialog(JSON.stringify(row, null, '\t'))
  }

  const hideFullData = () => props.updateDialog('')

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
        <TableRowColumn><FloatingActionButton onClick={curry(showFullData)(row)}><ContentAdd /></FloatingActionButton></TableRowColumn>
        {renderDialog()}
      </TableRow>
    )
  }

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
export default connect(mapStateToProps, mapDispatchToProps)(SplitTable)
