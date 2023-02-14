import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/ChristianNorbertBraun/theempathicdev.git', // Update to point to your repository
  user: {
   name: 'Christian Braun', // update to use your name
   email: 'christian.braun@theempathicdev.de' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);