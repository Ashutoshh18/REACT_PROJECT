import React, { useState } from 'react';
import AddStudent from './components/AddStudent';
import RetrieveMarksheet from './components/RetrieveMarksheet';

function App() {
  const [currentPage, setCurrentPage] = useState('addMarks');

  return (
    <div>
      <h1>Student Marksheet System</h1>
      <div>
        <button onClick={() => setCurrentPage('addMarks')}>Enter Marks by Student ID</button>
        {' '}
        <button onClick={() => setCurrentPage('retrieve')}>Retrieve Marksheet by Student ID</button>
      </div>
      <hr />

      {currentPage === 'addMarks' && <AddStudent />}
      {currentPage === 'retrieve' && <RetrieveMarksheet />}
    </div>
  );
}

export default App;
