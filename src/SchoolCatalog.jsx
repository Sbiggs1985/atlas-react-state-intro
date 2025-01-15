import React, { useState, useEffect } from 'react';

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'trimester', // Default column to sort by
    direction: 'ascending', // Default sorting direction
  });

  useEffect(() => {
    // Fetch data from the API
    fetch('/api/courses.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data); // Update the courses state with the fetched data
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []); // Empty dependency array ensures this runs only on mount

  // Sort courses based on the selected column and direction
  const sortedCourses = [...courses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filtered courses based on the search term
  const filteredCourses = sortedCourses.filter((course) => {
    const searchTermLower = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive comparison
    return (
      course.courseNumber.toLowerCase().includes(searchTermLower) ||
      course.courseName.toLowerCase().includes(searchTermLower)
    );
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search by Course Number or Course Name"
        value={searchTerm} // Bind input value to searchTerm state
        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state as user types
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('trimester')}>Trimester</th>
            <th onClick={() => requestSort('courseNumber')}>Course Number</th>
            <th onClick={() => requestSort('courseName')}>Courses Name</th>
            <th onClick={() => requestSort('semesterCredits')}>Semester Credits</th>
            <th onClick={() => requestSort('totalClockHours')}>Total Clock Hours</th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, index) => (
            <tr key={index}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button>Enroll</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  );
}