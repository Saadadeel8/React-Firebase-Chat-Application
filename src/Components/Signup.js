import React, { useState } from 'react';
import { Form, Input, Button, message, Upload, Image, } from 'antd';
import ImgCrop from 'antd-img-crop';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import { db, auth, storageRef } from './Services/base';
import preview from './preview.jpg';
import {
    Link,
    useHistory
  } from "react-router-dom";
  
const Signup = () => {

  const history = useHistory();
  const [fields, setFields] = useState([{name: ['username'], value: '',},]);
  const [fileList, setFileList] = useState([
  ]);
  
  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = (values) => { 
    const {email, password, fullname, phone} = values
   
    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;

      const uploadTask = storageRef.ref(`users/${user.uid}`).child('Display Picture').put(fileList[0].originFileObj);
      uploadTask.on('state_changed',
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
      },
      (error) => {
          // Handle unsuccessful uploads
          console.log("error:-", error)
      },
      () => {
          // Handle successful uploads on complete
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
              user.updateProfile({
                displayName: fullname,
                phoneNumber: phone,
                photoURL: downloadURL
              });
              message.info(`Successfully Signed Up`)
              db.collection("users").doc(user.uid).set({
                uid: user.uid,
                Name: fullname,
                Contacts:[],
                photoURL: downloadURL
              }).then(() => {
                history.push('/Login')
              }).catch((error) => {
                  console.error("Error writing document: ", error);
              }); 
              });

          });
      }
  )};

  const CustomizedForm = () => ( 
    <div>
      
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
        <h1>User Sign Up</h1>
        <div className='image-upload'>
          <ImgCrop rotate>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
          </ImgCrop>
        </div>
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
