import React, { useState } from 'react';
import './App.css';

const dummyUser = {
  email: 'amit.gupta@college.edu',
  password: 'amit123',
};

const dummySchedules = [
  { id: 1, className: 'B.Tech CSE - DBMS', time: '10:00 AM to 12:00 PM' },
  { id: 2, className: 'B.Tech IT - OS', time: '12:00 PM to 2:00 PM' },
  { id: 3, className: 'B.Tech AI - ML Basics', time: '2:00 PM to 4:00 PM' },
];

const dummyStudents = [
  { id: 1, scholarNo: '23U01000' },
  { id: 2, scholarNo: '23U01001' },
  { id: 3, scholarNo: '23U01002' },
  { id: 4, scholarNo: '23U01003' },
];

function App() {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === dummyUser.email && pass === dummyUser.password) {
      setStep('date');
    } else {
      alert('Invalid credentials!');
    }
  };

  const handleClassClick = (cls) => {
    if (!selectedDate) {
      alert('Please select a date first.');
      return;
    }
    setSelectedClass(cls);
    setStep('attendance');
  };

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    const newRecord = {
      date: selectedDate,
      className: selectedClass.className,
      attendance,
    };
    const existing = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
    localStorage.setItem('attendanceHistory', JSON.stringify([...existing, newRecord]));
    alert('Attendance submitted!');
    setStep('date');
    setSelectedClass(null);
    setAttendance({});
  };

  const history = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
  const filteredHistory = history.filter((record) => {
    const matchDate = filterDate ? record.date === filterDate : true;
    const matchClass = filterClass ? record.className === filterClass : true;
    return matchDate && matchClass;
  });

  return (
    <div className="container">
      {step === 'login' && (
        <>
          <h2>Professor Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
        </>
      )}

      {step === 'date' && (
        <>
          <h2>Welcome Prof. Amit Gupta</h2>
          <label>Select Date for Attendance:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <h3 style={{ marginTop: '20px' }}>Today's Scheduled Classes</h3>
          {dummySchedules.map((cls) => (
            <div className="card" key={cls.id} onClick={() => handleClassClick(cls)}>
              <h4>{cls.className}</h4>
              <p>{cls.time}</p>
            </div>
          ))}
          <br />
          <div style={{ display: 'flex', gap: '75px', marginTop: '20px' }}>
            <button onClick={() => setStep('history')}>View Attendance History</button>
            <button
              onClick={() => {
                setStep('login');
                setEmail('');
                setPass('');
                setSelectedClass(null);
                setAttendance({});
                setSelectedDate('');
              }}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}

      {step === 'attendance' && selectedClass && (
        <>
          <h2>{selectedClass.className}</h2>
          <p>Date: {selectedDate}</p>
          <p>Time: {selectedClass.time}</p>
          <h4>Mark Attendance</h4>
          {dummyStudents.map((student, index) => (
  <div
    key={student.id}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: '500px',
      marginBottom: '8px',
      padding: '8px 16px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      backgroundColor: '#f9f9f9',
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ fontSize: '16px' }}>
      {index + 1}. <strong>{student.scholarNo}</strong>
    </span>
    <input
      type="checkbox"
      checked={attendance[student.id] || false}
      onChange={() => toggleAttendance(student.id)}
      style={{ transform: 'scale(1.2)' }}
    />
  </div>
))}

          <div style={{ marginTop: '15px' }}>
            <button onClick={handleSubmit}>Submit Attendance</button>
            <button onClick={() => setStep('date')} style={{ marginLeft: '10px' }}>Back</button>
          </div>
        </>
      )}

      {step === 'history' && (
        <>
          <h2>Attendance History</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>Filter by Date: </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <label style={{ marginLeft: '20px' }}>Filter by Class: </label>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="">All</option>
              {[...new Set(history.map(h => h.className))].map((cls, i) => (
                <option key={i} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {filteredHistory.length === 0 ? (
            <p>No attendance records match the filter.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class</th>
                  <th>Student Scholar No.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record, idx) =>
                  dummyStudents.map((student) => (
                    <tr key={`${idx}-${student.id}`}>
                      <td>{record.date}</td>
                      <td>{record.className}</td>
                      <td>{student.scholarNo}</td>
                      <td>{record.attendance[student.id] ? 'P' : 'A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          <br />
          <button onClick={() => setStep('date')}>Back to Schedule</button>
        </>
      )}
    </div>
  );
}

export default App;
