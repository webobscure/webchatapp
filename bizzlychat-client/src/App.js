import React from 'react'

import { BrowserRouter as Router,Route} from 'react-router-dom'

//components
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import VideoCall from './components/VideoCall/VideoCall'


const App = () => (
    <Router>
        <Route path="/"  exact component={Join}/>
        <Route path="/chat" render={(props) => <Chat {...props} />} />
        <Route path="/chatweb" component={VideoCall} />

        
    </Router>
)

export default App;