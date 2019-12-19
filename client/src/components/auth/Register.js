import React, {useState, useContext, useEffect} from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Register = props => {

  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const {setAlert} = alertContext;
  const {register, error, clearErrors, isAuthenticated} = authContext;

  useEffect(() => {
    if(isAuthenticated){
      props.history.push('/');
    }

    if(error === 'User already exists'){
      setAlert(error, 'danger');
      clearErrors();
    }

    //eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    name : '',
    email : '',
    password : '',
    password2 : ''
  });

  const {name, email, password, password2 } = user;

  const onChange = e => setUser({...user, [e.target.name] : e.target.value});

  const onSubmit = e => {
    e.preventDefault();
    if(name === '' || email === '' || password === ''){
      setAlert('Please enter all fields', 'danger');
    }
    else if(password !== password2){
      setAlert('Passwords do not match', 'danger');
    }
    else{
      register({
        name,
        email,
        password
      });
    }
  };

  return(
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit = {onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required placeholder="Name" value = {name} onChange = {onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" id="email" required placeholder="Email" value = {email} onChange = {onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required minLength='6' placeholder="Password" value = {password} onChange = {onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input type="password" name="password2" id="password2" required minLength="6" placeholder="Confirm Password" value = {password2} onChange = {onChange} />
        </div>
        <input type="submit" value="Register" className="btn btn-primary btn-block" />
      </form>
    </div>
  );
};

export default Register;
