import { Switch, Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import Login from './Login';
import Post from './Post';

function Routes() {
    return (
        <div>
            <CookiesProvider>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/demoPost" component={Post} />
                    </Switch>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    )
}

export default Routes;