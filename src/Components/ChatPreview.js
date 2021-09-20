/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import './Styles/chat.css';
import { Input, Search, Empty, Tooltip, Button, message, Avatar, Upload, Image } from 'antd';
import ImgCrop from 'antd-img-crop';
import firebase from "firebase/app";
import _ from 'lodash';
import chunk from 'lodash/chunk';
import 'firebase/auth';
import 'firebase/firestore';
import { SendOutlined, PoweroffOutlined, UserAddOutlined, SearchOutlined, CloseOutlined, UserOutlined, PictureFilled} from '@ant-design/icons';
import { auth, db, storageRef  } from './Services/base';
import {
    Link,
    useHistory
  } from "react-router-dom";

const ChatPreview = ({user}) => {
    const { TextArea } = Input;
    const history = useHistory();
    const [friendList, setFriendList] = useState([]); //Friend list results
    const [searchList, setSearchList] = useState([]); //Search results
    const [searchResult, setSearchResult] = useState(false); //Trigger to display search results
    const [searchBar, setSearchBar] = useState(false);
    const [search, setSearch] = useState(''); //Text to search for someone
    const [text, setText] = useState(''); //Save text from textbox
    const [receiver, setReceiver] = useState(''); //Data of contact/receiver
    const [messages, setMessages] = useState([]); //Container for messages
    const [selectedFriend, setSelectedFriend] = useState(''); //highlightling selected friend
    const [fileList, setFileList] = useState([]);
    const [receiverPicture, setReceiverPicture] = useState('')
    const [comparisonList, setComparisonList] = useState([])
    const messageEl = useRef(null);
    const docRef = (receiver) => [user.displayName, receiver].sort().join("-");

    useEffect(() => {
        if (messageEl) {
          messageEl.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
      }, [])

    useEffect(() => {
        // Get all Messages from documents
        if(receiver){
            db.collection('messages').doc(docRef(receiver))
            .onSnapshot(querySnapshot => {
                let messages = [];
                const userMsgs = querySnapshot.data();
                userMsgs.items.forEach((msg) => {messages.push(msg)});
                console.log(messages)
                setMessages(messages)
            })
        }
    }, [receiver])

    useEffect(() => {
        //Get data of All Users
        db.collection('users')
        .onSnapshot((querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push({...doc.data()});
            });
            setSearchList(users)
            
        })
        //Get Data of Added Friends
        db.collection('users').doc(user.uid)
        .onSnapshot((querySnapshot) => {
            let friends = [];
            const userData = querySnapshot.data();
            userData.Contacts.forEach((contact) => {friends.push(contact)});
            setFriendList(friends)
            
        })
        
    }, [])

    const onChange = ({ fileList: newFileList }) => {
        const uploadTask = storageRef.ref(`users/${user.uid}`).child('Display Picture').put(newFileList[0].originFileObj);
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
                photoURL: downloadURL
                });
            })})
            db.collection("users").doc(user.uid).add({
                photoURL: downloadURL
            })
        };

    const handleLogout = () => {
        auth.signOut()
        history.push('/Login')
    }
    const comparer = (otherArray) => {
        return function (current) {
          return (
            otherArray.filter(function (other) {
              return other.uid === current.uid;
            }).length === 0
          );
        };
      }
    const imageIDGenerator = () => {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      }

    const handleMessage = async (e) => {
        e.preventDefault();
        const { uid, displayName, photoURL } = user;
        const trimmedMessage = text.trim();
        const messagesRef = db.collection('messages').doc(docRef(receiver));
        if (trimmedMessage) {
            // Add new message in Firestore
            messagesRef.update({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: firebase.firestore.FieldValue.arrayUnion({
                text: trimmedMessage,
                uid,
                displayName
            })
            });

            db.collection("users").doc(user.uid).update({
                Contacts: friendList.filter(friend => friend.uid !== selectedFriend)
            }).then(()=>{
            const addFriend = db.collection('users').doc(user.uid)
            addFriend.update({
            Contacts: firebase.firestore.FieldValue.arrayUnion({
                Name: receiver,
                uid: selectedFriend,
                DisplayPicture: receiverPicture,
                lastMessage: Date.now(),
                })
            });
            });
            // Clear input field
            setText('');
        }
    }

    const addFriend = (contact) => {
        const addFriend = db.collection('users').doc(user.uid)
            addFriend.update({
            // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            Contacts: firebase.firestore.FieldValue.arrayUnion({
                Name: contact.Name,
                uid: contact.uid,
                DisplayPicture: contact.photoURL,
                lastMessage: Date.now()
                })
            });
            message.info(`${contact.Name} successfully added as friend`)
        const { uid, displayName, photoURL } = user;
        const newChat = db.collection('messages').doc(docRef(contact.Name));
            // Add new message in Firestore
            newChat.set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: firebase.firestore.FieldValue.arrayUnion({
                text: null,
                media: '',
                uid,
                displayName
                })
            });
            // Clear input field
            message.info('Chat Started')
    }

    const initiateChat = async (friend) => {
        setReceiver(friend.Name)
        setReceiverPicture(friend.DisplayPicture)
        setSelectedFriend(friend.uid)
    }

    const escapeButton = (e) => {
        setSearchResult(false)
        setSearchBar(false)
    }

    const onSendPicture = ({ fileList: newFileList }) => {
        const uploadPic = storageRef.ref(`chats/${docRef(receiver)}`).child(`${imageIDGenerator()}`).put(newFileList[0].originFileObj);
        uploadPic.on('state_changed',
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
            uploadPic.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                handlePictures(downloadURL)
            })})
    };

    const handlePictures = (pic) => {
        const { uid, displayName, photoURL } = user;
        const messagesRef = db.collection('messages').doc(docRef(receiver));
            messagesRef.update({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: firebase.firestore.FieldValue.arrayUnion({
                text,
                media: pic,
                uid,
                displayName
            })
            });
            db.collection("users").doc(user.uid).update({
                Contacts: friendList.filter(friend => friend.uid !== selectedFriend)
            }).then(()=>{
            const addFriend = db.collection('users').doc(user.uid)
            addFriend.update({
            Contacts: firebase.firestore.FieldValue.arrayUnion({
                Name: receiver,
                uid: selectedFriend,
                DisplayPicture: receiverPicture,
                lastMessage: Date.now(),
                })
            });
            });
    }
    return (
        <div className='chat-screen'>
            <div className='chat-history'>
                <div className='menu-bar'>
                    <div className='logout'>
                        <Tooltip title='Logout'>
                            <Button shape='circle' icon={<PoweroffOutlined /> } onClick={handleLogout}/>
                        </Tooltip>
                    </div>
                    {searchBar==true? 
                    <div className='search-bar'>
                        <Input style={{width: '90%'}, {margin: '0 5px -5px 0'}} placeholder="Search a User to Add" onChange={(e)=> setSearch(e.target.value)} />
                            <div className='search-button'>
                                <Tooltip title='Search User'>
                                    <Button shape='circle' icon={<SearchOutlined /> } size='small' onClick={(e)=> setSearchResult(true)}/>
                                </Tooltip>
                            </div>
                    </div> 
                    :user.photoURL? 
                    <div className='display-picture'>
                        <Avatar size={64} src={user.photoURL} shape='circle'/>
                    </div>
                    :<div className='display-picture'>
                        <ImgCrop rotate>
                            <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            >
                            {fileList.length < 1 && '+ Upload'}
                            </Upload>
                        </ImgCrop>
                    </div>}
                    <div className='add-friends'>
                        <Tooltip title='Add Friends'>
                            <Button shape='circle' icon={<UserAddOutlined /> } onClick={(e)=>setSearchBar(!searchBar)}/>
                        </Tooltip>
                    </div>
                </div>
                {searchResult==true? 
                <div className='gap'>
                    <div className='escape'><Button shape='circle' size='small' icon={<CloseOutlined /> } onClick={escapeButton}/></div>
                    {friendList.filter(comparer(searchList)).concat(searchList.filter(comparer(friendList))).filter(user => user.Name.toLowerCase().includes(search)).map((contact, index) => (
                        <div className='all-users' key={index}>
                            <h2>{contact.Name}</h2>
                            <div className='add-button'>
                            <Button onClick={()=>addFriend(contact)} >
                            Add as Friend
                            </Button>
                            </div>
                        </div>
                    ))}
                </div> 
                :<div className='gap'>
                    {friendList.filter(user => user.Name.toLowerCase().includes(search)).sort((a, b) => b.lastMessage-a.lastMessage).map((friend, index) => (
                        <div className={selectedFriend === friend.uid? 'selected-friend':'show-friend'} onClick={()=> initiateChat(friend)} 
                        key={index}>
                        {friend.DisplayPicture ? <div className='friendlist-picture'><Avatar size={64} src={friend.DisplayPicture} shape='circle'/></div> 
                        :<div className='stock-picture'><Avatar size={64} icon={<UserOutlined/>} shape='circle'/></div>}<h2>{friend.Name}</h2></div>
                    ))}
                </div>}
            </div>
            <div className='chat-section'>
                <div className='chat-messages' ref={messageEl}>
                   <div className='receiver-info'>
                       {receiverPicture? 
                            <div className='receiver-picture'>
                                <Avatar size={64} src={receiverPicture} shape='circle'/>
                            </div>
                            :receiver.length?
                            <div className='receiver-picture'>
                                <Avatar size={64} icon={<UserOutlined/>} shape='circle'/>
                            </div>
                            :null
                        }<h1 style={{color:'white'}}>{receiver}</h1>
                    </div>
                    <div className='container'>
                        {receiver.length? 
                            messages.filter(msg => msg.text?.length > 1 || msg.media.length > 1 ).map((message, index) => (
                                <div key={index} className={`messages-container ${message.displayName === user.displayName ? 'right-side': 'left-side'}`}>
                                    <p>{message.text}</p>
                                    {message.media? <img src={message.media} width='300px'/>:null}
                                </div>
                            )) 
                            :<div className='empty-chat'>
                                <Empty
                                description={
                                <span>
                                    Select a Friend to start chatting
                                </span>
                                }
                                />
                            </div>
                        }
                  </div>
                </div>
                <div className='chat-typing'>
                    <div className='pic-icon'>
                        <Upload
                            fileList={fileList}
                            onChange={onSendPicture}
                        ><Button icon={<PictureFilled />} />{fileList.length < 1}
                        </Upload></div>
                    <div className='text-area'>
                        <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter Message' autoSize={{ minRows: 2, maxRows: 4 }} onPressEnter={handleMessage} autoFocus/>
                    </div>
                    <div className='send-icon'>
                        <button type='submit' onClick={(text) => handleMessage(text)} disabled={!text}><SendOutlined /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChatPreview;
