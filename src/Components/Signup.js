import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import firebase from "firebase/app"
import "firebase/auth";
import preview from './preview.jpg'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";

export default function Signup() {

  const history = useHistory()


const [fields, setFields] = useState([
    {
      name: ['username'],
      value: '',
    },
  ]);
  
  const handleSubmit = (values) => { 
    console.log(values)

    firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    user.updateProfile({
      displayName: values.fullname,
      phoneNumber: values.phone,

    });
    alert('Signed up successfully')
    history.push('/Login')
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);
    // ..
  })
    }
    
    

    const CustomizedForm = () => ( 
        <div className='UserForm'>
            <label><h1>User Sign Up</h1></label>
            <Form
            name="global_state"
            layout="inline"
            onFinish={handleSubmit}
        
        >
        <ul><label><Form.Item
            name="fullname"
            
            rules={[
            {
              required: true,
              message: 'Full Name is required!',
            },
            ]}>
                
            <Input placeholder = 'Full Name'/>
            </Form.Item>
            </label></ul>
        <ul><label><Form.Item
            name="email"
            
            rules={[
            {
              required: true,
              message: 'E-mail is required!',
            },
          ]}>

            <Input placeholder = 'Email ID'/>
            </Form.Item>
            </label></ul>
        <ul><label><Form.Item
            name="phone"
            
            rules={[
            {
              required: true,
              message: 'Mobile Number is required!',
            },
            ]}>

            <Input placeholder = 'Mobile Number'/>
            </Form.Item>
            </label></ul>
        <ul><label><Form.Item
        name="password"
        
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
        >
        <Input.Password placeholder = 'Password'/>
        </Form.Item>
            </label></ul>

        <div className='button'>
            <Form.Item>
            <br />
            <Button type="primary" htmlType="submit">
             Submit
            </Button>
            <br /><br />Already have an account?   <Link to={"/Login"}> Login</Link>
            </Form.Item></div>
            </Form>
        </div>
        
        );

        
  return (
    
    <div className='Interface'>
      <CustomizedForm
        fields={fields}
        onChange={(newFields) => {
          setFields(newFields);
        }}
      />
      <div className='stockImage'><img src={preview} height='600px' width='800px'/></div>
    </div>
  );
}
