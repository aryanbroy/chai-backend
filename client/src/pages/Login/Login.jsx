import React, { useEffect, useState } from 'react'
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit'
import styles from "./Login.module.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ColorRing } from 'react-loader-spinner';

export default function Login() {

    const navigate = useNavigate();
    const [contents, setContents] = useState({}); // we get email and pass here
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    // console.log(userData)
    // console.log(error)

    const handleChange = (e) => {
        setContents({ ...contents, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            setError(null);
            const res = await axios.post(`/api/users/login`, contents, { withCredentials: true });


            if (res?.response?.data.statusCode >= 400 || res?.response?.data.success === false) {
                setLoading(false);
                setError(error.response);
                return;
            }
            const data = res.data.data.user;
            // console.log(data);
            setUserData(data)
            setLoading(false)
            navigate("/");
        } catch (error) {
            // console.log(error)
            setLoading(false)
            setError(error.response?.data.message);
        }
    }

    return (
        <div className={styles.mainLoginDiv}>
            <div className={styles.innerLoginDiv}>

                <form onSubmit={handleSubmit}>
                    <MDBContainer className="p-5 my-5 d-flex flex-column w-50" id={styles.loginBox}>

                        <MDBInput wrapperClass='mb-4 p-1' name='email' label='Email address' labelClass='text-white' id='form1' type='email' size='lg' onChange={handleChange} style={{ color: "white" }} required />
                        <MDBInput wrapperClass='mb-4 p-1' name='password' label='Password' labelClass='text-white' id='form2' type='password' size='lg' onChange={handleChange} style={{ color: "white" }} required />

                        {error && <p className='text-danger'>{error}</p>}

                        <div className="d-flex justify-content-between mx-3 mb-4">
                            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                            <a href="!#">Forgot password?</a>
                        </div>

                        <MDBBtn className="mb-4 p-2" style={{ fontWeight: "900", fontSize: "20px" }} type='submit'>
                            {loading ?
                                <ColorRing
                                    visible={true}
                                    height="40"
                                    width="40"
                                    ariaLabel="color-ring-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="color-ring-wrapper"
                                    colors={["#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9"]}
                                />
                                : "Sign in"}
                        </MDBBtn>

                        <div className="text-center">
                            <p className="h5 lead">Not a member? <Link to={"/register"} className='text-decoration-none'>Register</Link></p>
                            <p>or sign in with:</p>

                            <div className='d-flex justify-content-between mx-auto' style={{ width: '40%' }}>
                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='facebook-f' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='twitter' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='google' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='github' size="sm" />
                                </MDBBtn>

                            </div>
                        </div>

                    </MDBContainer>
                </form>
            </div>
        </div>
    )
}
