import React, {useState} from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import firebase from "firebase/app"
require("firebase/auth");
import {
  Link,
  useHistory
} from "react-router-dom";
import {Alert } from 'antd';
import preview from './preview.jpg'

export default function Login() {
  const [error, setError] = useState(false)
  const history = useHistory()
  const handleSubmit = (values) => {
    
    firebase.auth().signInWithEmailAndPassword(values.email, values.password)
    .then((userCredential) => {
    // Signed in
    history.push('/ChatPreview')
    var user = userCredential.user;
    
    })
    .catch(() => {
      setError(true)
  })};
    
  return (
   
    <div className='Interface'>
    <div className='UserForm'>  
    {error == true? 
    <Alert
      message="Error"
      description="Username or Password is wrong"
      type="error"
      showIcon
    />: null}
    <label><h1>Login</h1></label> 

    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in 
        </Button>
         <br />Or   <Link to={"/"}> Register Now</Link>
      </Form.Item>
    </Form>
    </div> 
    <div className='stockImage'><img src={preview} height='600px' width='800px'/></div>
    
    </div>
   
  );
};