import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import firebase from "firebase/app";
import "firebase/auth";
import { db,auth } from './Services/base';
import preview from './preview.jpg';
import {
    Link,
    useHistory
  } from "react-router-dom";

const Signup = () => {

  const history = useHistory();
  const [fields, setFields] = useState([{name: ['username'], value: '',},]);

  const handleSubmit = (values) => { 
    const {email, password, fullname, phone} = values
   
    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      user.updateProfile({
        displayName: fullname,
        phoneNumber: phone,
      });
      alert('Signed up successfully')
      db.collection("users").doc(user.uid).set({
        uid: user.uid,
        Name: fullname,
        Contacts:[]
      })
      .then(() => {
          console.log("Document successfully written!");
      })
      .catch((error) => {
          console.error("Error writing document: ", error);
      });
      history.push('/Login')
      })
    .catch((error) => {
      console.log(error)
    })};
    
  const CustomizedForm = () => ( 
    <div>
      <label>
        <h1>User Sign Up</h1>
      </label>
      <Form
        name="global_state"
        layout="inline"
        onFinish={handleSubmit}
      >
        <ul>
          <label>
            <Form.Item
              name="fullname"
              rules={[
              {
                required: true,
                message: 'Full Name is required!',
              },
              ]}
              >
                <Input placeholder = 'Full Name'/>
            </Form.Item>
          </label>
        </ul>
        <ul>
          <label>
            <Form.Item
              name="email"
              rules={[
              {
                required: true,
                message: 'E-mail is required!',
              },
              ]}
            >
              <Input placeholder = 'Email ID'/>
            </Form.Item>
          </label>
        </ul>
        <ul>
          <label>
            <Form.Item
              name="phone"
              rules={[
              {
                required: true,
                message: 'Mobile Number is required!',
              },
              ]}
            >
              <Input placeholder = 'Mobile Number'/>
            </Form.Item>
          </label>
        </ul>
        <ul>
          <label>
            <Form.Item
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
          </label>
        </ul>
        <div className='button'>
          <Form.Item><br />
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
      <div className='user-form'>
      <CustomizedForm
        fields={fields}
        onChange={(newFields) => {
          setFields(newFields);
        }}
      />
      </div>
      <div className='stock-image'><img src={preview} height='600px' width='800px'/></div>
    </div>
  );
}

export default Signup; 
