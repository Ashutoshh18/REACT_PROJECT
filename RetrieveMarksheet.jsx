import React, { useState, useEffect } from 'react';

const HARDCODED_STUDENTS = [
  { stdid: '101', sapNo: '50001001', name: 'Ashutosh', rollNo: '2101', program: 'B.Tech CSE' },
  { stdid: '102', sapNo: '50001002', name: 'Lavya', rollNo: '2102', program: 'B.Tech CSE' },
  { stdid: '103', sapNo: '50001003', name: 'Manthan', rollNo: '2103', program: 'B.Tech CSE' }
];

const SEMESTER_OPTIONS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8'
];

function RetrieveMarksheet() {
  const [searchId, setSearchId] = useState('');
  const [searchSemester, setSearchSemester] = useState('Semester 1');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  const fetchMarksheet = () => {
    const idQuery = searchId.trim();
    if (!idQuery) {
      setStudent(null);
      setError('');
      return;
    }

    // Match stdid or sapNo from hardcoded student list
    const hardcodedMatch = HARDCODED_STUDENTS.find(
      s => s.stdid.toLowerCase() === idQuery.toLowerCase() || s.sapNo.toLowerCase() === idQuery.toLowerCase()
    );

    const actualId = hardcodedMatch ? hardcodedMatch.stdid : idQuery;

    const existingStudents = JSON.parse(localStorage.getItem('students') || '{}');
    const recordKey = `${actualId}_${searchSemester}`;
    
    // Retrieve only user-saved marksheets from localStorage
    const foundStudent = existingStudents[recordKey] || existingStudents[actualId];

    if (foundStudent) {
      setStudent({
        ...foundStudent,
        semester: searchSemester
      });
      setError('');
    } else {
      setStudent(null);
      setError(`No marksheet record saved yet for Student ID "${idQuery}" in ${searchSemester}. Please enter marks first.`);
    }
  };

  useEffect(() => {
    if (searchId.trim()) {
      fetchMarksheet();
    } else {
      setStudent(null);
      setError('');
    }
  }, [searchId, searchSemester]);

  const handleRetrieve = (e) => {
    e.preventDefault();
    fetchMarksheet();
  };

  return (
    <div>
      <h2>Retrieve Student Marksheet by Student ID (stdid)</h2>
      <form onSubmit={handleRetrieve}>
        <div>
          <label><strong>Enter Student ID (stdid): </strong></label>
          <input
            type="text"
            placeholder="Enter stdid (e.g. 101, 102, 103)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            required
          />
          {' '}
          <label><strong>Semester: </strong></label>
          <select
            value={searchSemester}
            onChange={(e) => setSearchSemester(e.target.value)}
          >
            {SEMESTER_OPTIONS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
          {' '}
          <button type="submit">Retrieve Marksheet</button>
          <p><small>(Available Student IDs: <strong>101</strong> for Ashutosh, <strong>102</strong> for Lavya, <strong>103</strong> for Manthan)</small></p>
        </div>
      </form>

      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {student && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginTop: '10px' }}>
          <h3>Student Marksheet ({student.semester || searchSemester})</h3>
          <p><strong>Student Name:</strong> {student.name}</p>
          <p><strong>Student ID (stdid):</strong> {student.stdid || searchId}</p>
          <p><strong>SAP No:</strong> {student.sapNo}</p>
          <p><strong>Roll No:</strong> {student.rollNo}</p>
          <p><strong>Program:</strong> {student.program}</p>

          <h4>Subject Wise Exam Marks</h4>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>ICA Marks</th>
                <th>ESM Marks</th>
                <th>Total Marks (Out of 100)</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects &&
                student.subjects.map((sub, index) => {
                  const total = (parseFloat(sub.ica) || 0) + (parseFloat(sub.esm) || 0);
                  return (
                    <tr key={index}>
                      <td>{sub.subject}</td>
                      <td>{sub.ica}</td>
                      <td>{sub.esm}</td>
                      <td><strong>{total}</strong></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <br />
          <p><strong>Calculated SGPA:</strong> {student.sgpa}</p>
        </div>
      )}
    </div>
  );
}

export default RetrieveMarksheet;
