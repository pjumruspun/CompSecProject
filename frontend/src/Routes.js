import { Switch, Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import { CookiesProvider } from 'react-cookie';
import Login from './Login';

function Routes() {
    return (
        <div>
            <CookiesProvider>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route exact path="/login" component={Login} />
                    </Switch>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    )
}

export default Routes;