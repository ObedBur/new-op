import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('http://localhost:4000');
    console.log('ROOT:', res.status, res.data);
  } catch (e) {
    console.log('ROOT ERROR:', e.message);
  }

  try {
    const res = await axios.post('http://localhost:4000/auth/login', {});
    console.log('LOGIN:', res.status, res.data);
  } catch (e) {
    console.log('LOGIN ERROR:', e.response?.status, e.response?.data);
  }
}

test();
