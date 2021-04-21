import React, { useState } from 'react'
import Layout from '../core/Layout';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


const Forgot = () => {

    const [values, setValues] = useState({
        email: "mertuygur02@gmail.com",
        buttonText: "Submit"
    });
    const {email, buttonText} = values
    
    

    const passwordForgotForm = () => (
        <form>
            <div>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" onChange = {handleChange('email')} value={email} />
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
            method: 'PUT',
            url : `${process.env.REACT_APP_API}/forgot-password`,
            data: {email}
        })
        .then(res => {
            console.log('FORGOT PASSWORD Success', res);
            //save the response (user, token) localstorage/cookie
            toast.success(res.data.message);
            setValues({...values, buttontext: 'Requested'})
        })
        .catch(err => {
            console.log('FORGOT PASSWORD Error', err.response.data)
            toast.error(err.response.data.error)

            setValues({...values, buttonText: 'Submit'});
        })
    }

    return (
        <Layout>
            <div>
                <ToastContainer />
                <h1>Forgot Password</h1>
                {passwordForgotForm()}
            </div>
            
        </Layout>
    )
}

export default Forgot
