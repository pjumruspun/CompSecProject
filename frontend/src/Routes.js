import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import Feed from './Feed';
import { CookiesProvider } from 'react-cookie';
import Login from './Login';
import Post from './Feed/Post';
import Comment from './Feed/Comment';
import AuthGuard from './AuthGuard'

function Routes() {
    return (
        <div>
            <CookiesProvider>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/" component={() =><Redirect to="/home"/>} />
                        {/* AuthGuard will prevent render these below components before authenticated */}
                        <AuthGuard>
                            <Route exact path="/home" component={Feed} />
                            <Route exact path="/demoPost" component={Post} />
                            <Route exact path="/demoComment" component={Comment} />
                        </AuthGuard>
                    </Switch>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    )
}

export default Routes;