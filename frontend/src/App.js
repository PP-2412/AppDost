import React, { useState, useEffect } from 'react';
import { Home, LogOut, User, ThumbsUp, MessageCircle, Edit2, Trash2, Send } from 'lucide-react';

// IMPORTANT: Change this to your backend URL
// For local development: http://localhost:5000/api
// For production: https://your-backend-url.com/api
const API_URL = 'https://appdost-production.up.railway.app/api';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
      setCurrentPage('feed');
    }
  }, []);

  useEffect(() => {
    if (currentPage === 'feed' && token) {
      fetchPosts();
    }
  }, [currentPage, token]);

  const fetchCurrentUser = async (authToken) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
      handleLogout();
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {token && user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} setCurrentPage={setCurrentPage} currentPage={currentPage} />
          <div className="max-w-4xl mx-auto px-4 py-8">
            {currentPage === 'feed' && <Feed posts={posts} setPosts={setPosts} token={token} user={user} fetchPosts={fetchPosts} />}
            {currentPage === 'profile' && <Profile user={user} setUser={setUser} token={token} />}
          </div>
        </>
      ) : (
        <AuthPage setToken={setToken} currentPage={currentPage} setCurrentPage={setCurrentPage} setUser={setUser} />
      )}
    </div>
  );
}

function Navbar({ user, onLogout, setCurrentPage, currentPage }) {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AppDost
            </h1>
            <button
              onClick={() => setCurrentPage('feed')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'feed' 
                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Home size={20} />
              <span className="hidden sm:inline font-medium">Feed</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage('profile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'profile' 
                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <User size={20} />
              <span className="hidden sm:inline font-medium">{user.name}</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AuthPage({ setToken, currentPage, setCurrentPage, setUser }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const endpoint = currentPage === 'login' ? 'login' : 'signup';
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">LinkedInClone</h1>
          <h2 className="text-2xl font-bold text-gray-800">
            {currentPage === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {currentPage === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : currentPage === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          {currentPage === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')}
            className="text-blue-600 font-medium hover:underline"
          >
            {currentPage === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

function Feed({ posts, setPosts, token, user, fetchPosts }) {
  return (
    <div className="space-y-6">
      <CreatePost token={token} user={user} onPostCreated={fetchPosts} />
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p className="text-lg">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} token={token} user={user} setPosts={setPosts} />
          ))}
        </div>
      )}
    </div>
  );
}

function CreatePost({ token, user, onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setContent('');
        onPostCreated();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none"
          rows="3"
        />
        
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, token, user, setPosts }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isOwner = user._id === post.userId;
  const isLiked = post.likes.includes(user._id);

  const handleLike = async () => {
    try {
      const res = await fetch(`${API_URL}/posts/${post._id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedPost = await res.json();
      setPosts(prev => prev.map(p => p._id === post._id ? updatedPost : p));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`${API_URL}/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: editContent })
      });
      const updatedPost = await res.json();
      setPosts(prev => prev.map(p => p._id === post._id ? updatedPost : p));
      setIsEditing(false);
    } catch (err) {
      console.error('Error editing post:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await fetch(`${API_URL}/posts/${post._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(prev => prev.filter(p => p._id !== post._id));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`${API_URL}/posts/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      const updatedPost = await res.json();
      setPosts(prev => prev.map(p => p._id === post._id ? updatedPost : p));
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{post.userName}</h3>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
        {isOwner && !isEditing && (
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition">
              <Edit2 size={16} />
            </button>
            <button onClick={handleDelete} className="text-red-600 hover:bg-red-50 p-2 rounded transition">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex space-x-2">
            <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-200 px-4 py-1 rounded-md text-sm hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
      )}

      <div className="flex items-center space-x-4 pt-3 border-t">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md transition ${isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm font-medium">{post.likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded-md transition"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 border-t pt-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              <Send size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            {post.comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{comment.userName}</p>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Profile({ user, setUser, token }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, bio: user.bio || '' });

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile</h2>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="flex space-x-2">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium">
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Name</p>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Bio</p>
            <p className="text-lg">{user.bio || 'No bio yet. Click edit to add one!'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Member Since</p>
            <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
