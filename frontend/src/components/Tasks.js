import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Tasks() {
  const { projectId } = useParams();
  const token = localStorage.getItem('token');

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: '' });

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleAddTask = async () => {
    if (!form.title || !form.status) {
      alert('Title and status are required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/tasks',
        { ...form, project_id: projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ title: '', description: '', status: '' });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to add task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return (
    <div id="tasks">
      <h2>Tasks for Project {projectId}</h2>
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <input
        placeholder="Status"
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
      />
      <button onClick={handleAddTask}>Add Task</button>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '20px', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description || <i>No description</i>}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Tasks;
