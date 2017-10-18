import React from 'react'
import Timechop from './timechop'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'


class App extends React.Component {
  componentWillMount() {
    injectTapEventPlugin();
  }

  render() {
    return (
      <MuiThemeProvider>
        <Timechop />
      </MuiThemeProvider>
    )
  }
}
export default App
