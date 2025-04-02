'use client';
import { useState, useEffect } from 'react';

interface Post {
  id: number;
  content: string;
  isEditing?: boolean;
}

export default function BlogPostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [editedContent, setEditedContent] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    const parsedPosts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];
    setPosts(parsedPosts);

    // Set initial last ID on first load
    const lastUsedId = localStorage.getItem('lastUsedId');
    if (!lastUsedId) {
      localStorage.setItem('lastUsedId', '0'); // Start at 0 if not set
    }
  }, []);

  const addPost = () => {
    if (!newPost.trim()) return;

    // Get and increment the last used ID
    const lastUsedId = Number(localStorage.getItem('lastUsedId')) || 0;
    const newId = lastUsedId + 1;

    // Store the new last used ID back in localStorage
    localStorage.setItem('lastUsedId', newId.toString());

    const updatedPosts: Post[] = [...posts, { id: newId, content: newPost, isEditing: false }];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setNewPost('');
  };

  const toggleEditPost = (id: number, content: string) => {
    setEditedContent({ ...editedContent, [id]: content });
    setPosts(posts.map(post =>
      post.id === id ? { ...post, isEditing: !post.isEditing } : post
    ));
  };

  const saveEditPost = (id: number) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, content: editedContent[id] || post.content, isEditing: false } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setEditedContent(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const deletePost = (id: number) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Blog Post Manager</h2>
      <input
        data-testid="create"
        type="text"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        className="border p-2 m-2"
      />
      <button
        data-testid="add"
        onClick={addPost} className="bg-blue-500 text-white p-2">Add Post</button>
      <ul>
        {posts.map(post => (
          <li 
          id={`post-${post.id}`}
          key={post.id} className="p-2 border mt-2">
            {post.isEditing ? (
              <>
                <input
                data-testid={`posteditinput${post.id}`}
                  type="text"
                  value={editedContent[post.id] || post.content}
                  onChange={(e) => setEditedContent({ ...editedContent, [post.id]: e.target.value })}
                  className="border p-1"
                />
                <button 
                 data-testid={`postedit${post.id}`}
                onClick={() => saveEditPost(post.id)} className="bg-green-500 text-white p-1 ml-2">Save</button>
              </>
            ) : (
              <>
                <span>{post.content}</span>
                <button
                  data-testid={`edit-${post.id}`}
                  onClick={() => toggleEditPost(post.id, post.content)} className="bg-yellow-500 text-white p-1 ml-2">Edit</button>
                <button
                  data-testid={`delete-${post.id}`}
                  onClick={() => deletePost(post.id)} className="bg-red-500 text-white p-1 ml-2">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
