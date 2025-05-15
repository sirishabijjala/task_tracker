import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  // Create project
  const handleCreate = async () => {
    if (!projectName.trim()) {
      alert('Enter project name');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/projects',
        { name: projectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
      setProjectName('');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div id="dash">
      <h2>Dashboard</h2>
      <input
        placeholder="Project Name"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
      />
      <button onClick={handleCreate}>Add Project</button>

      <ul>
        {projects.map(proj => (
          <li key={proj.id}>
            {proj.name} &nbsp;
            <button onClick={() => navigate(`/tasks/${proj.id}`)}>View Tasks</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
