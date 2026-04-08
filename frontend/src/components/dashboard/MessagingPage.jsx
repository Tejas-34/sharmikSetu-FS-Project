import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Search, ArrowLeft, MessageSquare, Clock, Plus, Users, X, Check, AtSign } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import Button from '../ui/Button';

const MessagingPage = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [groupFormData, setGroupFormData] = useState({ name: '', members: [] });
  const [userSearchText, setUserSearchText] = useState('');
  
  // Mention States
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [currentThreadMembers, setCurrentThreadMembers] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(-1);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const fetchInbox = async () => {
    try {
      const data = await apiFetch('/messages/messages/inbox/');
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to fetch inbox', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await apiFetch('/all-users/');
      setAllUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchThreadMembers = async (groupId) => {
    try {
      const groupData = await apiFetch(`/messages/groups/${groupId}/`);
      setCurrentThreadMembers(groupData.members_details || []);
    } catch (err) {
      console.error('Failed to fetch group members', err);
    }
  };

  const fetchThread = async (otherUserId = null, groupId = null, jobId = null) => {
    setThreadLoading(true);
    try {
      const params = new URLSearchParams();
      if (otherUserId) params.append('with_user', otherUserId);
      if (groupId) {
        params.append('group_id', groupId);
        fetchThreadMembers(groupId);
      } else {
        setCurrentThreadMembers([]);
      }
      if (jobId) params.append('job_id', jobId);
      
      const data = await apiFetch(`/messages/messages/thread/?${params.toString()}`);
      setMessages(data || []);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to fetch thread', err);
    } finally {
      setThreadLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;

    try {
      const body = { content: newMessage.trim() };
      if (selectedThread.groupId) body.group = selectedThread.groupId;
      else {
        body.recipient = selectedThread.otherUserId;
        if (selectedThread.jobId) body.job = selectedThread.jobId;
      }

      await apiFetch('/messages/messages/', {
        method: 'POST',
        body,
      });
      setNewMessage('');
      setShowMentions(false);
      fetchThread(selectedThread.otherUserId, selectedThread.groupId, selectedThread.jobId);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupFormData.name.trim() || groupFormData.members.length === 0) return;

    try {
      const group = await apiFetch('/messages/groups/', {
        method: 'POST',
        body: {
          name: groupFormData.name.trim(),
          members: groupFormData.members,
        },
      });
      setShowGroupModal(false);
      setGroupFormData({ name: '', members: [] });
      fetchInbox();
      selectConversation({ group: group.id, group_name: group.name });
    } catch (err) {
      console.error('Failed to create group', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchInbox();
    fetchAllUsers();
    
    // Parse URL parameters for direct navigation
    const params = new URLSearchParams(window.location.search);
    const withUserId = params.get('with_user');
    const jobId = params.get('job_id');
    const groupId = params.get('group_id');

    if (withUserId) {
      setSelectedThread({
        otherUserId: withUserId,
        otherUserName: 'Loading...', // Temporary
        groupId: null,
        jobId: jobId
      });
      fetchThread(withUserId, null, jobId);
    } else if (groupId) {
      setSelectedThread({
        groupId: groupId,
        groupName: 'Loading...',
        otherUserId: null
      });
      fetchThread(null, groupId);
    }

    const interval = setInterval(fetchInbox, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedThread) {
      const interval = setInterval(() => {
        fetchThread(selectedThread.otherUserId, selectedThread.groupId, selectedThread.jobId);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedThread]);

  const selectConversation = (conv) => {
    if (conv.group) {
      setSelectedThread({
        groupId: conv.group,
        groupName: conv.group_name,
        otherUserId: null,
        otherUserName: null,
        jobId: null,
        jobTitle: null,
      });
      fetchThread(null, conv.group);
    } else {
      const otherUserId = conv.group ? null : (conv.sender === currentUser.id ? conv.recipient : conv.sender);
      const otherUserName = conv.group ? null : (conv.sender === currentUser.id ? conv.recipient_name : conv.sender_name);
      setSelectedThread({
        otherUserId,
        otherUserName,
        groupId: null,
        groupName: null,
        jobId: conv.job,
        jobTitle: conv.job_title,
      });
      fetchThread(otherUserId, null, conv.job);
    }
  };

  const toggleMember = (userId) => {
    setGroupFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const selectionStart = e.target.selectionStart;
    setNewMessage(value);

    // Check for @ mention
    const textBeforeCursor = value.slice(0, selectionStart);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch && selectedThread?.groupId) {
      setShowMentions(true);
      setMentionFilter(mentionMatch[1]);
      setMentionIndex(mentionMatch.index);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user) => {
    const beforeMention = newMessage.slice(0, mentionIndex);
    const afterMention = newMessage.slice(inputRef.current.selectionStart);
    const updatedMessage = `${beforeMention}@${user.full_name} ${afterMention}`;
    
    setNewMessage(updatedMessage);
    setShowMentions(false);
    inputRef.current.focus();
  };

  const filteredUsers = allUsers.filter(u => 
    u.id !== currentUser.id && 
    (u.email.toLowerCase().includes(userSearchText.toLowerCase()) || 
     u.full_name.toLowerCase().includes(userSearchText.toLowerCase()))
  );

  const mentionList = currentThreadMembers.filter(m => 
    m.id !== currentUser.id &&
    m.full_name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-180px)] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm relative">
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 flex-col border-r border-slate-100 ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Messages</h2>
            <button 
              onClick={() => setShowGroupModal(true)}
              className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Create Group Chat"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading inbox...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No conversations yet.</div>
          ) : (
            conversations.map((conv) => {
              const otherUserId = conv.group ? null : (conv.sender === currentUser.id ? conv.recipient : conv.sender);
              const isActive = conv.group 
                ? selectedThread?.groupId === conv.group
                : selectedThread?.otherUserId === otherUserId;
              
              const displayName = conv.group ? conv.group_name : (conv.sender === currentUser.id ? conv.recipient_name : conv.sender_name);

              return (
                <div
                  key={conv.group ? `g-${conv.group}` : `u-${conv.id}`}
                  onClick={() => selectConversation(conv)}
                  className={`cursor-pointer p-4 transition hover:bg-slate-50 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500' : 'border-b border-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold uppercase ${conv.group ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                      {conv.group ? <Users size={16} /> : displayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="truncate font-semibold text-slate-900">
                          {displayName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                           {new Date(conv.timestamp).toLocaleDateString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                      <div className="mt-1 truncate text-xs text-slate-500">
                        {conv.sender === currentUser.id ? 'You: ' : `${conv.sender_name}: `}{conv.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex flex-1 flex-col bg-slate-50/50 ${!selectedThread ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!selectedThread ? (
          <div className="text-center p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-950">Select a conversation</h3>
            <p className="mt-2 text-sm text-slate-500">Pick someone or a group from your list to start chatting.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-4 border-b border-slate-200">
              <button onClick={() => setSelectedThread(null)} className="md:hidden text-slate-500">
                <ArrowLeft size={20} />
              </button>
              <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold uppercase ${selectedThread.groupId ? 'bg-indigo-500' : 'bg-blue-100 text-blue-600'}`}>
                {selectedThread.groupId ? <Users size={18} /> : selectedThread.otherUserName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-950">{selectedThread.groupId ? selectedThread.groupName : selectedThread.otherUserName}</div>
                {selectedThread.jobTitle && (
                  <div className="text-xs text-blue-600 font-medium">Re: {selectedThread.jobTitle}</div>
                )}
                {selectedThread.groupId && (
                  <div className="text-xs text-slate-500 font-medium">Group Chat • {currentThreadMembers.length} members</div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isMine = msg.sender === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    {!isMine && selectedThread.groupId && (
                      <div className="mb-1 text-[10px] font-bold text-slate-500 ml-3">{msg.sender_name}</div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none'}`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      <div className={`mt-1 text-[10px] flex items-center gap-1 ${isMine ? 'text-blue-100 justify-end' : 'text-slate-400'}`}>
                        <Clock size={10} />
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Mentions */}
            <div className="p-4 bg-white border-t border-slate-200 relative">
              {showMentions && mentionList.length > 0 && (
                <div className="absolute bottom-full left-4 mb-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden py-2 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1 flex items-center gap-2">
                    <AtSign size={10} /> Mention Group Member
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {mentionList.map(member => (
                      <div 
                        key={member.id}
                        onClick={() => insertMention(member)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                          {member.full_name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{member.full_name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{member.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message... use @ to mention someone"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-blue-500 transition-all"
                />
                <Button type="submit" className="p-3 !min-h-0 !min-w-0 aspect-square">
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-950">Create Group Chat</h3>
              <button onClick={() => setShowGroupModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Group Name</label>
                <input
                  type="text"
                  required
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({...groupFormData, name: e.target.value})}
                  placeholder="e.g. Site Morning Shift"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Select Members</label>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={userSearchText}
                    onChange={(e) => setUserSearchText(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div className="max-h-52 overflow-y-auto space-y-2 pr-2">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">No users found.</div>
                  ) : (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id} 
                        onClick={() => toggleMember(user.id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${groupFormData.members.includes(user.id) ? 'bg-blue-50 border-blue-200 border' : 'hover:bg-slate-50 border border-transparent'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
                            {user.full_name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{user.full_name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                          </div>
                        </div>
                        {groupFormData.members.includes(user.id) ? (
                          <div className="bg-blue-500 text-white rounded-full p-1"><Check size={12}/></div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-slate-300" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowGroupModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={!groupFormData.name.trim() || groupFormData.members.length === 0}>
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;
