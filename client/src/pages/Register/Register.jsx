import React, { useRef, useState } from 'react'
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit'
import styles from "./Register.module.css";
import { Link } from 'react-router-dom';
import { TbPhotoUp } from "react-icons/tb";


export default function Register() {
    const [imageFile, setImageFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const imageRef = useRef();
    const coverImageRef = useRef();

    // console.log(imageFile)
    console.log(coverImageFile);
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    }

    const handleCoverImageChange = (e) => {
        setCoverImageFile(e.target.files[0]);
    }
    // get path
    // use axios to upload the desired path to cloudinary
    return (
        <div className={styles.mainLoginDiv}>
            <div className={styles.innerLoginDiv}>
                <MDBContainer className="p-5 my-3 d-flex flex-column w-50" id={styles.loginBox}>
                    <div>
                        <div className={styles.avatarMainDiv}>
                            <input type="file" accept='image/*' onChange={handleImageChange} ref={imageRef} style={{ display: "none" }} />
                            <div className={styles.avatarDiv} onClick={() => imageRef.current.click()}>
                                <MDBIcon fas icon="user-plus" size="4x" className={styles.avatarIcon} />
                            </div>
                            <input type="file" accept="image/*" onChange={handleCoverImageChange} ref={coverImageRef} style={{ display: "none" }} />
                            <div className={styles.textDiv} onClick={() => coverImageRef.current.click()}><TbPhotoUp size={23} /> Upload Cover image</div>
                        </div>
                    </div>

                    <MDBInput wrapperClass='mb-4 p-1' label='Full Name' labelClass='text-white' id='form1' type='text' size='lg' style={{ color: "white" }} />
                    <MDBInput wrapperClass='mb-4 p-1' label='Username' labelClass='text-white' id='form2' type='text' size='lg' style={{ color: "white" }} />
                    <MDBInput wrapperClass='mb-4 p-1' label='Email address' labelClass='text-white' id='form3' type='email' size='lg' style={{ color: "white" }} />
                    <MDBInput wrapperClass='mb-4 p-1' label='Password' labelClass='text-white' id='form4' type='password' size='lg' style={{ color: "white" }} />

                    <div className="d-flex justify-content-between mx-3 mb-4">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                        <a href="!#">Forgot password?</a>
                    </div>

                    <MDBBtn className="mb-4 p-2" style={{ fontWeight: "900", fontSize: "20px" }}>Sign Up</MDBBtn>

                    <div className="text-center">
                        <p className="h5 lead">Already a member? <Link to={"/login"} className='text-decoration-none'>Login</Link></p>
                        <p>or sign up with:</p>

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
            </div>

        </div>
    )
}
