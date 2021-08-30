import React from 'react'
import './Styles/chat.css'
import { Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';


export default function ChatPreview() {
    const { TextArea } = Input;
    const handleMessage = () => {

    }
    return (
        <div className='chat-screen'>
            <div className='chat-history'></div>
            <div className='chat-section'>
                <div className='chat-messages'></div>
                <div className='chat-typing'>
                    <div className='text-area'><TextArea row={2} maxLength={100} bordered onPressEnter={handleMessage}/></div>
                    <div className='send-icon'><button><SendOutlined /></button></div>
                </div>
            </div>
        </div>
    )
}
