import { Component, useContext } from "react";
import { Switch, Route, Link, HashRouter, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Login } from "./components/login.component";
import { Register } from "./components/register.component";
import { Profile } from "./components/profile.component";
import { UploadPictures } from "./components/upload.component";
import { TodoProvider } from "./context/TodoProvider";
import 'antd/dist/antd.css';
import { TodoContext } from './context/TodoContext';
import { upload } from "@testing-library/user-event/dist/upload";
type Props = {};

export const App = () => {
    const { Todo } = useContext( TodoContext );
    const userStr = Todo && Todo.username ? Todo.username : null;
    
    return (
      <TodoProvider>
      <HashRouter>
      <div>

        <div>
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/employees" component={Profile}/>
            <Route exact path="/upload" component={UploadPictures}/>
            <Redirect to={`${userStr != null || userStr != undefined ? "/employees": "/"}`} />
          </Switch>
        </div>

      </div>
      </HashRouter>
      </TodoProvider>
    );
  }

export default App;
