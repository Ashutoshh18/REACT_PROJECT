import React, { useState, useEffect } from 'react';

const HARDCODED_STUDENTS = [
  {
    stdid: '101',
    sapNo: '50001001',
    name: 'Ashutosh',
    rollNo: '2101',
    program: 'B.Tech CSE'
  },
  {
    stdid: '102',
    sapNo: '50001002',
    name: 'Lavya',
    rollNo: '2102',
    program: 'B.Tech CSE'
  },
  {
    stdid: '103',
    sapNo: '50001003',
    name: 'Manthan',
    rollNo: '2103',
    program: 'B.Tech CSE'
  }
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

function AddStudent() {
  const [searchId, setSearchId] = useState('');
  const [foundStudent, setFoundStudent] = useState(null);
  const [searchError, setSearchError] = useState('');

  const [semester, setSemester] = useState('Semester 1');
  
  // Marks and subjects set as "" initially for user to fill
  const [subjects, setSubjects] = useState([
    { subject: '', ica: '', esm: '' }
  ]);

  const [sgpa, setSgpa] = useState(0);
  const [message, setMessage] = useState('');

  // Search function to locate hardcoded student by stdid or sapNo
  const handleSearchStudent = (e) => {
    if (e) e.preventDefault();
    const query = searchId.trim();
    
    if (!query) {
      setFoundStudent(null);
      setSearchError('Please enter a Student ID (stdid).');
      return;
    }

    const matched = HARDCODED_STUDENTS.find(
      (s) => s.stdid.toLowerCase() === query.toLowerCase() || s.sapNo.toLowerCase() === query.toLowerCase()
    );

    if (matched) {
      setFoundStudent(matched);
      setSearchError('');
      setMessage('');
      // Reset subject fields to empty strings for fresh input
      setSubjects([{ subject: '', ica: '', esm: '' }]);
    } else {
      setFoundStudent(null);
      setSearchError(`Student not found for ID "${query}". Available IDs: 101 (Ashutosh), 102 (Lavya), 103 (Manthan).`);
      setMessage('');
    }
  };

  // useEffect to calculate SGPA automatically when subjects change
  useEffect(() => {
    let totalGradePoints = 0;
    let validSubjectCount = 0;

    subjects.forEach((item) => {
      const icaVal = parseFloat(item.ica);
      const esmVal = parseFloat(item.esm);

      if (!isNaN(icaVal) && !isNaN(esmVal)) {
        const totalMarks = icaVal + esmVal;
        let gradePoint = totalMarks / 10;
        if (gradePoint > 10) gradePoint = 10;
        totalGradePoints += gradePoint;
        validSubjectCount++;
      }
    });

    if (validSubjectCount > 0) {
      const calculatedSgpa = (totalGradePoints / validSubjectCount).toFixed(2);
      setSgpa(calculatedSgpa);
    } else {
      setSgpa(0);
    }
  }, [subjects]);

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subject: '', ica: '', esm: '' }]);
  };

  const handleDeleteSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!foundStudent) {
      alert('Please search and find a valid student first.');
      return;
    }

    if (subjects.length === 0 || !subjects[0].subject) {
      alert('Please add at least one subject with exam marks.');
      return;
    }

    const studentData = {
      stdid: foundStudent.stdid,
      name: foundStudent.name,
      sapNo: foundStudent.sapNo,
      rollNo: foundStudent.rollNo,
      program: foundStudent.program,
      semester,
      subjects,
      sgpa
    };

    const existingStudents = JSON.parse(localStorage.getItem('students') || '{}');
    
    // Store record by composite key (stdid_Semester) as well as stdid and sapNo
    const recordKey = `${foundStudent.stdid}_${semester}`;
    existingStudents[recordKey] = studentData;
    existingStudents[foundStudent.stdid] = studentData;
    existingStudents[foundStudent.sapNo] = studentData;

    localStorage.setItem('students', JSON.stringify(existingStudents));

    setMessage(`Marksheet for ${foundStudent.name} (${foundStudent.stdid} - ${semester}) saved successfully!`);

    // Reset subject fields to empty
    setSubjects([{ subject: '', ica: '', esm: '' }]);
  };

  return (
    <div>
      <h2>Enter Student Marks by Student ID (stdid)</h2>
      
      {/* Search Bar for stdid */}
      <form onSubmit={handleSearchStudent}>
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
          <button type="submit">Search Student</button>
          <p><small>(Available Student IDs: <strong>101</strong> for Ashutosh, <strong>102</strong> for Lavya, <strong>103</strong> for Manthan)</small></p>
        </div>
      </form>

      <br />
      {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Found Student Details and Mark Entry Form */}
      {foundStudent && (
        <form onSubmit={handleSubmit}>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <h3>Student Details Found</h3>
            <p><strong>Student Name:</strong> {foundStudent.name}</p>
            <p><strong>Student ID (stdid):</strong> {foundStudent.stdid}</p>
            <p><strong>SAP No:</strong> {foundStudent.sapNo}</p>
            <p><strong>Roll No:</strong> {foundStudent.rollNo}</p>
            <p><strong>Program:</strong> {foundStudent.program}</p>
          </div>
          <br />

          <div>
            <label><strong>Select Semester: </strong></label>
            <select 
              value={semester} 
              onChange={(e) => {
                setSemester(e.target.value);
                setMessage('');
              }}
            >
              {SEMESTER_OPTIONS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
          <br />

          <h3>Subject & Exam Marks</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>ICA Marks (Exam 1)</th>
                <th>ESM Marks (Exam 2)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter Subject Name"
                      value={item.subject}
                      onChange={(e) =>
                        handleSubjectChange(index, 'subject', e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="ICA Marks"
                      value={item.ica}
                      onChange={(e) =>
                        handleSubjectChange(index, 'ica', e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="ESM Marks"
                      value={item.esm}
                      onChange={(e) =>
                        handleSubjectChange(index, 'esm', e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubject(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <button type="button" onClick={handleAddSubject}>
            Add Subject
          </button>

          <br />
          <br />
          <div>
            <strong>Calculated SGPA: {sgpa}</strong>
          </div>

          <br />
          <button type="submit">Save Student Marksheet</button>
        </form>
      )}
    </div>
  );
}

export default AddStudent;
