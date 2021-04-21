import React, { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken';
import Layout from '../core/Layout';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


const Reset = ({match}) => {

    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        email: "mertuygur02@gmail.com",
        buttonText: "Submit"
    });

    useEffect(() => {
        let token = match.params.token
        let {name} = jwt.decode(token);
        if(token) {
            setValues({...values, name, token})
        }
    }, [])

    const {name, token, newPassword, buttonText} = values
    const passwordResetForm = () => (
        <form>
            <div>
                <label htmlFor="newPassword">New Password</label>
                <input required type="text" id="newPassword" onChange = {handleChange} value={newPassword} />
            </div>

            <div>
                <button onClick={handleSubmit}>{buttonText}</button>
            </div>
        </form>
    )
    const handleChange = (e) => {
        setValues({...values, newPassword: e.target.value})
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'PUT',
            url : `${process.env.REACT_APP_API}/reset-password`,
            data: {newPassword, resetPasswordLink: token}
        })
        .then(res => {
            console.log('Reset PASSWORD Success', res);
            //save the response (user, token) localstorage/cookie
            toast.success(res.data.message);
            setValues({...values, buttontext: 'Done'})
        })
        .catch(err => {
            console.log('Reset PASSWORD Error', err.response.data)
            toast.error(err.response.data.error)

            setValues({...values, buttonText: 'Submit'});
        })
    }

    return (
        <Layout>
            <div>
                <ToastContainer />
                <h1>Hey {name}, It is the Reset Password page.</h1>
                {passwordResetForm()}
            </div>
            
        </Layout>
    )
}

export default Reset
