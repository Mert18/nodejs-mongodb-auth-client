import React, { useState } from 'react'
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { authenticate, isAuth } from './helpers';

const Signin = ({history}) => {

    const [values, setValues] = useState({
        email: "",
        password: "",
        buttonText: "Submit"
    });
    const {email, password, buttonText} = values
    
    

    const signIn = () => (
        <form>
            <div>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" onChange = {handleChange('email')} value={email} />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange = {handleChange('password')} value={password} />
            </div>
            <div>
                <button onClick={handleSubmit}>{buttonText}</button>
            </div>
        </form>
    )
    const handleChange = (name) => (e) => {
        setValues({...values, [name]: e.target.value})
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'POST',
            url : `${process.env.REACT_APP_API}/signin`,
            data: {email, password}
        })
        .then(res => {
            console.log('SIGN In Success', res);
            //save the response (user, token) localstorage/cookie
            authenticate(res, () => {
                setValues({...values,email: '', password: '', buttonText: 'Submitted'})
                //toast.success(`Hey ${res.data.user.name}, Welcome back!`)
                isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
            })

            
        })
        .catch(err => {
            console.log('Sign In Error', err.response.data)
            setValues({...values, buttonText: 'Submit'});
            toast.error(err.response.data.error)
        })
    }

    return (
        <Layout>
            <div>
                <ToastContainer />
                {isAuth() ? <Redirect to="/" /> : null}
                <h1>Sign In</h1>
                {signIn()}
                <br />
                <Link to="/auth/password/forgot">Forgot Password</Link>
            </div>
            
        </Layout>
    )
}

export default Signin
