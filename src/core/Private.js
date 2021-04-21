import React, { useState, useEffect } from 'react'
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import {isAuth, getCookie, signout, updateUser} from '../auth/helpers';
import 'react-toastify/dist/ReactToastify.min.css';


const Private = ({history}) => {

    const [values, setValues] = useState({
        role: '',
        name: "",
        email: "",
        password: "",
        buttonText: "Submit"
    });
    useEffect(() => {
        loadProfile();
    }, [])

    const token = getCookie('token');
    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log('PRIVATE PROFILE UPDATE', res)
            const {role, name, email} = res.data;
            setValues({...values, role, name, email})
        })
        .catch(err => {
            console.log('PRIVATE PROFILE UPDATE ERROR', err.res.data.error);
            if(err.res.status === 401){
                signout(() => {
                    history.push('/')
                })
            }

        })
    }

    const {role, name, email, password, buttonText} = values
    
    

    const updateForm = () => (
        <form>
            <div>
                <label htmlFor="role">Role</label>
                <input disabled type="text" id="role" defaultValue={role} />
            </div>
            <div>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" onChange = {handleChange('name')} defaultValue={name} />
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input disabled type="text" id="email" onChange = {handleChange('email')} defaultValue={email} />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange = {handleChange('password')} defaultValue={password} />
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
            url : `${process.env.REACT_APP_API}/user/update`,
            data: {name, password},
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log('PRIVATE PROFILE UPDATE SUCCESS', res);
            updateUser(res, () => {
                setValues({...values, buttonText: 'Submitted'})
                toast.success('Profile updated successfully.')
            })
            
        })
        .catch(err => {
            console.log('PRIVATE PROFILE UPDATE error', err.response.data.error)
            setValues({...values, buttonText: 'Submit'});
            toast.error(err.response.data.error)
        })
    }

    return (
        <Layout>
            <div>
                <ToastContainer />
                <h1>Update</h1>
                {updateForm()}
            </div>
            
        </Layout>
    )
}

export default Private
