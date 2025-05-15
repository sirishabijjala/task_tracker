import { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    country: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!form.name || !form.email || !form.password || !form.country) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      console.log('Sending signup data:', form); // For debugging
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      alert(res.data.msg || 'Registered successfully!');
      
      // Optional: Clear form after registration
      setForm({ name: '', email: '', password: '', country: '' });
    } catch (err) {
      console.error('Signup Error:', err);
      alert(err.response?.data?.msg || 'Something went wrong. Please try again.');
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <input
        placeholder="Country"
        value={form.country}
        onChange={e => setForm({ ...form, country: e.target.value })}
      />

      <button type="submit">Register</button>
    </form>
  );
}

export default Signup;
