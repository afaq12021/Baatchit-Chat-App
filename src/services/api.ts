export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiService = {
  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  },

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  async getPostsWithUsers(): Promise<Post[]> {
    const [posts, users] = await Promise.all([
      this.getPosts(),
      this.getUsers(),
    ]);

    return posts.map(post => ({
      ...post,
      user: users.find(user => user.id === post.userId),
    }));
  },
};