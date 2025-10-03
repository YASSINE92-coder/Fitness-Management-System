import Post from '../../models/Post.js';

export default async function seedPosts(userId, coachId) {
  const post = await Post.create({
    title: 'Welcome to the gym!',
    content: 'We are open and ready to help you reach your goals.',
    media: '',
    media_type: 'event',
    comments: [
      { user_id: userId, content: 'Great news!', likes: 2 },
      { user_id: coachId, content: 'See you there!', likes: 5 },
    ],
  });
  return post;
}
