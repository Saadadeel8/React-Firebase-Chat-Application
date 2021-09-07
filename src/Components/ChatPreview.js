/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import './Styles/chat.css';
import { Input, Search, Empty, Tooltip, Button } from 'antd';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import { SendOutlined, LogoutOutlined, PoweroffOutlined} from '@ant-design/icons';
import { auth, db } from './Services/base';
import {
    Link,
    useHistory
  } from "react-router-dom";

const ChatPreview = ({user}) => {
    const { TextArea } = Input;
    const { Search } = Input;
    const history = useHistory();
    const [friendList, setFriendList] = useState([]); //Friend list results
    const [searchList, setSearchList] = useState([]); //Search results
    const [searchResult, setSearchResult] = useState(false); //Trigger to display search results
    const [search, setSearch] = useState(''); //Text to search for someone
    const [text, setText] = useState(''); //Save text from textbox
    const [receiver, setReceiver] = useState(''); //Data of contact/receiver
    const [messages, setMessages] = useState([]); //Container for messages
    const [selectedFriend, setSelectedFriend] = useState(''); //highlightling selected friend
    const docRef = (receiver) => [user.displayName, receiver].sort().join("-");

    useEffect(() => {
        // Get all Messages from documents
        if(receiver.length){
            db.collection('messages').doc(docRef(receiver))
            .onSnapshot(querySnapshot => {
                let messages = [];
                const userMsgs = querySnapshot.data();
                userMsgs.items.forEach((msg) => {messages.push(msg)});
                console.log(messages)
                setMessages(messages)
            })
        }
    }, [receiver.length])

    useEffect(() => {
        //Get data of All Users
        db.collection('users')
        .onSnapshot((querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push({...doc.data()});
            });
            setSearchList(users);
        })
    }, [])

    useEffect(() => {
        //Get Data of Added Friends
        db.collection('users').doc(user.uid)
        .onSnapshot((querySnapshot) => {
            let friends = [];
            const userData = querySnapshot.data();
            userData.Contacts.forEach((contact) => {friends.push(contact)});
            setFriendList(friends);
        });
    }, [user])

    const handleLogout = () => {
        auth.signOut()
        history.push('/Login')
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
            // Clear input field
            setText('');
        }
    }

    const addFriend = (contact) => {
        const addFriend = db.collection('users').doc(user.uid)
            addFriend.update({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            Contacts: firebase.firestore.FieldValue.arrayUnion({
                Name: contact.Name,
                uid: contact.uid,
                })
            });
            // Clear input field
            console.log('Contact Added')
            const { uid, displayName, photoURL } = user;

        const newChat = db.collection('messages').doc(docRef(contact.Name));
            // Add new message in Firestore
            newChat.set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            items: firebase.firestore.FieldValue.arrayUnion({
                text: '',
                uid,
                displayName})
            });
            // Clear input field
            console.log('Chat Started')
    }

    const initiateChat = async (friend) => {
        setReceiver(friend.Name)
        setSelectedFriend(friend.uid)
    }
   
    return (
        <div className='chat-screen'>
            <div className='chat-history'>
                <div className='search-bar'>
                    <div className='logout'>
                    <Tooltip title='Logout'>
                        <Button shape='circle' icon={<PoweroffOutlined /> } onClick={handleLogout}/>
                    </Tooltip>
                    </div>
                    <Search placeholder="Enter Friend's Fullname" allowClear style={{ width: 200}} onChange={(e)=> setSearch(e.target.value)} onSearch={(e)=> setSearchResult(!searchResult)}/>
                </div>
                
                {searchResult==true? 
                <div className='gap'>
                    {searchList.filter(user => user.Name.toLowerCase().includes(search)).map((contact, index) => (
                        <div className='show-friend' onClick={()=>addFriend(contact)} key={index}><h2>{contact.Name}</h2></div>
                    ))}
                </div> 
                :<div className='gap'>
                    {friendList.filter(user => user.Name.toLowerCase().includes(search)).map((friend, index) => (
                        <div className={selectedFriend === friend.uid? 'selected-friend':'show-friend'} onClick={()=> initiateChat(friend)} 
                        key={index}><h2>{friend.Name}</h2></div>
                    ))}
                </div>}
            </div>
            <div className='chat-section' style={ messages.displayName === user.displayName ? { float: 'right'} 
            : messages.displayName === receiver ? {float: 'left'}
        : null}>
                <div className='chat-messages'>
                   <h1><div className='receiver-info'>{receiver}</div></h1>
                   
                   {receiver.length ? 
                    messages.map((message, index) => (
                    <div key={index} className={message.displayName === user.displayName ? 'right-side'
                    : message.displayName === receiver ? 'left-side'
                    : null }>
                    <p>{message.text}</p>
                    </div>
                    )) 
                    : <div className='empty-chat'><Empty
                    description={
                      <span>
                        Select a Friend to start chatting
                      </span>
                    }
                  /></div>} 
                  
                </div>
                
                <div className='chat-typing'>
                <form onSubmit={handleMessage}>
                    <div className='text-area'><TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter Message' /></div>
                    <div className='send-icon'><button type='submit' disabled={!text}><SendOutlined /></button></div>
                </form>
                </div>
            </div>
        </div>
    )
}
export default ChatPreview;
