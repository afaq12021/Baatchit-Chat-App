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
    try {
      const response = await fetch(`${BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  async getPostsWithUsers(): Promise<Post[]> {
    try {
      console.log('Starting to fetch posts with users...');
      const [posts, users] = await Promise.all([
        this.getPosts(),
        this.getUsers(),
      ]);

      console.log(`Fetched ${posts.length} posts and ${users.length} users`);

      const postsWithUsers = posts.map(post => ({
        ...post,
        user: users.find(user => user.id === post.userId),
      }));

      console.log('Successfully combined posts with users');
      return postsWithUsers;
    } catch (error) {
      console.error('Error fetching posts with users:', error);
      
      // Fallback to mock data if API fails
      console.log('Using fallback mock data...');
      return this.getMockPostsWithUsers();
    }
  },

  getMockPostsWithUsers(): Post[] {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '123-456-7890',
        website: 'johndoe.com',
        address: {
          street: '123 Main St',
          suite: 'Apt 1',
          city: 'New York',
          zipcode: '10001',
          geo: { lat: '40.7128', lng: '-74.0060' },
        },
        company: {
          name: 'Tech Corp',
          catchPhrase: 'Innovation at its best',
          bs: 'synergize scalable supply-chains',
        },
      },
      {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        phone: '098-765-4321',
        website: 'janesmith.com',
        address: {
          street: '456 Oak Ave',
          suite: 'Suite 2',
          city: 'Los Angeles',
          zipcode: '90210',
          geo: { lat: '34.0522', lng: '-118.2437' },
        },
        company: {
          name: 'Design Studio',
          catchPhrase: 'Creative solutions',
          bs: 'revolutionize end-to-end systems',
        },
      },
    ];

    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Getting Started with React Native',
        body: 'React Native is a powerful framework for building mobile applications. It allows you to use React and JavaScript to create native mobile apps for both iOS and Android.',
        userId: 1,
      },
      {
        id: 2,
        title: 'Understanding State Management',
        body: 'State management is crucial in React Native applications. Redux Toolkit provides a simple and efficient way to manage application state.',
        userId: 2,
      },
      {
        id: 3,
        title: 'API Integration Best Practices',
        body: 'When integrating APIs in React Native, it\'s important to handle errors gracefully and provide fallback data when the network is unavailable.',
        userId: 1,
      },
      {
        id: 4,
        title: 'UI/UX Design Principles',
        body: 'Good UI/UX design is essential for user engagement. Focus on simplicity, consistency, and intuitive navigation.',
        userId: 2,
      },
      {
        id: 5,
        title: 'Performance Optimization Tips',
        body: 'Optimizing performance in React Native involves techniques like lazy loading, image optimization, and efficient list rendering.',
        userId: 1,
      },
    ];

    return mockPosts.map(post => ({
      ...post,
      user: mockUsers.find(user => user.id === post.userId),
    }));
  },
};