import { useContext, useState } from 'react';
import { RouteComponentProps, Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";
import { TodoContext } from '../context/TodoContext';

interface RouterProps {
  history: string;
}

type Props = RouteComponentProps<RouterProps>;

  export const Login = ( props: Props ) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { Todo } = useContext( TodoContext );
  
  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }
  
  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    
    setMessage("");
    setLoading(true);
    
    
    AuthService.login(username, password).then(
      (res) => {
        if ((res.username === Todo.username) && (res.password === Todo.password ) ) {
          props.history.push("/employees");
        } else {
          setMessage("The email or password is incorrect");
          setLoading(false);
        }
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    );
  }

    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <div className='div-container-design'>
        <nav className="navbar navbar-expand nav-design">
      
      <div className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to={"/login"} className="nav-link">
            Login
          </Link>
        </li>

        <li className="nav-item">
          <Link to={"/register"} className="nav-link">
            Sign Up
          </Link>
        </li>
      </div>
  </nav> 
      <div className="col-md-12">
        <div className="card card-container">
          <div className='d-flex justify-content-center'>
            <h1 className='text-align-center'>Sign in</h1>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Field name="username" type="text" className="form-control" />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
      </div>
    );
}