import React, { useState, useEffect } from 'react';
import { studentApi } from './api';
import { 
  GraduationCap, 
  Users, 
  UserPlus, 
  UploadCloud, 
  Settings, 
  Moon, 
  Sun,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Activity,
  BarChart3,
  Award,
  BookOpen,
  ArrowUpDown,
  Loader2,
  FolderOpen
} from 'lucide-react';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected' | 'disconnected'
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Forms
  const [addForm, setAddForm] = useState({ name: '', email: '', percentage: 0, grade: '', section: '' });
  const [bulkJson, setBulkJson] = useState('');
  const [updateEmailForm, setUpdateEmailForm] = useState({ id: '', email: '' });
  const [gradeUpdateForm, setGradeUpdateForm] = useState({ start: '', end: '', grade: '' });
  const [sectionUpdateForm, setSectionUpdateForm] = useState({ grade: '', section: '' });
  const [deletePercentageForm, setDeletePercentageForm] = useState({ start: '', end: '' });

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getAllStudents();
      setStudents(data);
      setBackendStatus('connected');
    } catch (err) {
      setBackendStatus('disconnected');
      showToast('Error connecting to backend database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchType === 'all') {
      loadStudents();
      return;
    }

    setLoading(true);
    try {
      if (searchType === 'id') {
        const id = parseInt(searchQuery);
        if (isNaN(id)) {
          showToast('Please enter a valid numeric ID', 'error');
          setLoading(false);
          return;
        }
        const student = await studentApi.getStudentById(id);
        setStudents(student ? [student] : []);
        if (!student) showToast('No student found with that ID', 'error');
      } else if (searchType === 'name') {
        try {
          const student = await studentApi.getStudentByName(searchQuery);
          setStudents(student ? [student] : []);
        } catch {
          setStudents([]);
          showToast('No student found with that name', 'error');
        }
      } else if (searchType === 'percentage') {
        const pct = parseFloat(searchQuery);
        if (isNaN(pct)) {
          showToast('Please enter a valid percentage', 'error');
          setLoading(false);
          return;
        }
        const data = await studentApi.getStudentsByPercentage(pct);
        setStudents(data);
        if (data.length === 0) showToast('No students match this percentage', 'error');
      }
    } catch (err) {
      showToast('Search failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (columnName) => {
    setLoading(true);
    try {
      const sortedData = await studentApi.sortStudentsByColumn(columnName);
      setStudents(sortedData);
      showToast(`Sorted by ${columnName} (descending)`, 'success');
    } catch (err) {
      showToast(`Failed to sort by ${columnName}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email) {
      showToast('Name and Email are required', 'error');
      return;
    }
    try {
      const studentData = {
        name: addForm.name,
        email: addForm.email,
        percentage: Number(addForm.percentage),
        grade: addForm.grade || undefined,
        section: addForm.section || undefined
      };
      await studentApi.insertStudent(studentData);
      showToast('Student added successfully!', 'success');
      setAddForm({ name: '', email: '', percentage: 0, grade: '', section: '' });
      loadStudents();
      setActiveTab('list');
    } catch (err) {
      showToast('Failed to add student', 'error');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) {
        showToast('Input must be a JSON array of students', 'error');
        return;
      }
      await studentApi.insertListStudent(parsed);
      showToast('Bulk students uploaded!', 'success');
      setBulkJson('');
      loadStudents();
      setActiveTab('list');
    } catch (err) {
      showToast('Invalid JSON format or upload error', 'error');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm(`Are you sure you want to delete student ID ${id}?`)) return;
    try {
      await studentApi.deleteStudent(id);
      showToast('Student deleted', 'success');
      loadStudents();
    } catch (err) {
      showToast('Failed to delete student', 'error');
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    const id = parseInt(updateEmailForm.id);
    if (isNaN(id) || !updateEmailForm.email) {
      showToast('ID and Email are required', 'error');
      return;
    }
    try {
      await studentApi.updateStudentEmail(id, updateEmailForm.email);
      showToast('Email updated', 'success');
      setUpdateEmailForm({ id: '', email: '' });
      loadStudents();
    } catch (err) {
      showToast('Failed to update email', 'error');
    }
  };

  const handleUpdateGradesByPercentage = async (e) => {
    e.preventDefault();
    const start = parseFloat(gradeUpdateForm.start);
    const end = parseFloat(gradeUpdateForm.end);
    if (isNaN(start) || isNaN(end) || !gradeUpdateForm.grade) {
      showToast('Valid start, end percentages and grade are required', 'error');
      return;
    }
    try {
      await studentApi.updateStudentGradeByPercentage(start, end, gradeUpdateForm.grade);
      showToast(`Updated grade to "${gradeUpdateForm.grade}" for matching students`, 'success');
      setGradeUpdateForm({ start: '', end: '', grade: '' });
      loadStudents();
    } catch (err) {
      showToast('Failed to batch update grades', 'error');
    }
  };

  const handleUpdateSectionByGrade = async (e) => {
    e.preventDefault();
    if (!sectionUpdateForm.grade || !sectionUpdateForm.section) {
      showToast('Grade and Section are required', 'error');
      return;
    }
    try {
      await studentApi.updateSectionByStudentGrade(sectionUpdateForm.grade, sectionUpdateForm.section);
      showToast(`Assigned section "${sectionUpdateForm.section}" to students with grade "${sectionUpdateForm.grade}"`, 'success');
      setSectionUpdateForm({ grade: '', section: '' });
      loadStudents();
    } catch (err) {
      showToast('Failed to batch update sections', 'error');
    }
  };

  const handleDeleteByPercentage = async (e) => {
    e.preventDefault();
    const start = parseFloat(deletePercentageForm.start);
    const end = parseFloat(deletePercentageForm.end);
    if (isNaN(start) || isNaN(end)) {
      showToast('Valid start and end percentages are required', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete all students with percentage between ${start}% and ${end}%?`)) return;
    try {
      await studentApi.deleteStudentsByPercentage(start, end);
      showToast(`Successfully deleted students in percentage range.`, 'success');
      setDeletePercentageForm({ start: '', end: '' });
      loadStudents();
    } catch (err) {
      showToast('Failed to batch delete students', 'error');
    }
  };

  // Stats
  const totalStudents = students.length;
  const avgPercentage = totalStudents > 0 
    ? (students.reduce((acc, curr) => acc + curr.percentage, 0) / totalStudents).toFixed(2)
    : '0.00';
  const sections = Array.from(new Set(students.map(s => s.section).filter(Boolean)));
  const totalSections = sections.length;
  const topStudent = totalStudents > 0
    ? [...students].sort((a, b) => b.percentage - a.percentage)[0]
    : null;

  return (
    <div className="app-layout">
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 className="toast-icon" size={20} /> : <AlertCircle className="toast-icon" size={20} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <a href="#" className="brand" onClick={(e) => { e.preventDefault(); setActiveTab('list'); }}>
          <div className="brand-icon">
            <GraduationCap size={28} />
          </div>
          <span>Academia</span>
        </a>

        <div className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <Users size={18} /> Directory
          </button>
          <button 
            className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <UserPlus size={18} /> Register
          </button>
          <button 
            className={`nav-item ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            <UploadCloud size={18} /> Bulk Upload
          </button>
          <button 
            className={`nav-item ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            <Settings size={18} /> Batch Ops
          </button>
        </div>

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Top Header */}
        <header className="top-header">
          <div className="page-title">
            {activeTab === 'list' && (
              <>
                <h1>Student Directory</h1>
                <p>Search, filter, and manage registered students.</p>
              </>
            )}
            {activeTab === 'add' && (
              <>
                <h1>Register Student</h1>
                <p>Insert a single student record into the central database.</p>
              </>
            )}
            {activeTab === 'bulk' && (
              <>
                <h1>Bulk Upload</h1>
                <p>Import sets of student records using JSON format.</p>
              </>
            )}
            {activeTab === 'operations' && (
              <>
                <h1>Batch Operations</h1>
                <p>Run advanced batch updates and deletions.</p>
              </>
            )}
          </div>

          <div className="header-actions">
            <div className="status-badge" title="Database Connection Status">
              <div className={`status-dot ${backendStatus === 'connected' ? 'connected' : 'disconnected'}`}></div>
              {backendStatus === 'connected' ? 'DB Active' : 'Offline'}
            </div>
            <button className="btn btn-secondary" onClick={loadStudents} disabled={loading}>
              <Activity size={16} /> Refresh
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{totalStudents}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Average Score</span>
              <span className="stat-value">{avgPercentage}%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Active Sections</span>
              <span className="stat-value">{totalSections}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Highest Score</span>
              <span className="stat-value" style={{ fontSize: '1.25rem' }}>
                {topStudent ? topStudent.name : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="card">
          {activeTab === 'list' && (
            <>
              <div className="card-header">
                <span className="card-title">Directory Records</span>
                <form onSubmit={handleSearch} className="search-form">
                  <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="all">All</option>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="percentage">Score</option>
                  </select>
                  {searchType !== 'all' && (
                    <input 
                      type="text" 
                      placeholder={`Search...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  )}
                  <button type="submit" className="btn btn-primary">
                    <Search size={16} /> Search
                  </button>
                </form>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="loading-wrapper">
                    <Loader2 className="spinner" size={32} />
                  </div>
                ) : students.length === 0 ? (
                  <div className="empty-state">
                    <FolderOpen size={48} />
                    <h3>No records found</h3>
                    <p>No student data matches your current query.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('id')}>ID <ArrowUpDown size={12} style={{ display: 'inline' }} /></th>
                          <th onClick={() => handleSort('name')}>Name <ArrowUpDown size={12} style={{ display: 'inline' }} /></th>
                          <th>Email Address</th>
                          <th onClick={() => handleSort('percentage')}>Score <ArrowUpDown size={12} style={{ display: 'inline' }} /></th>
                          <th onClick={() => handleSort('grade')}>Grade <ArrowUpDown size={12} style={{ display: 'inline' }} /></th>
                          <th onClick={() => handleSort('section')}>Section <ArrowUpDown size={12} style={{ display: 'inline' }} /></th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td style={{ fontFamily: 'monospace' }}>#{student.id}</td>
                            <td style={{ fontWeight: 500 }}>{student.name}</td>
                            <td style={{ color: 'var(--text-sub)' }}>{student.email}</td>
                            <td style={{ fontWeight: 500 }}>{student.percentage}%</td>
                            <td>
                              <span className="badge badge-grade">{student.grade || '-'}</span>
                            </td>
                            <td>
                              {student.section ? (
                                <span className="badge badge-section">{student.section}</span>
                              ) : '-'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                className="btn btn-secondary btn-icon"
                                onClick={() => student.id && handleDeleteStudent(student.id)}
                                title="Delete record"
                                style={{ color: 'var(--accent-danger)', borderColor: 'transparent' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'add' && (
            <>
              <div className="card-header">
                <span className="card-title">Registration Form</span>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddStudent}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Jonathan Miller"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="e.g. j.miller@academia.edu"
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Percentage Score (%) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required 
                      min="0"
                      max="100"
                      placeholder="e.g. 91.25"
                      value={addForm.percentage}
                      onChange={(e) => setAddForm({ ...addForm, percentage: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Grade (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Leave blank for auto"
                        value={addForm.grade}
                        onChange={(e) => setAddForm({ ...addForm, grade: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Class Section (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Leave blank for auto"
                        value={addForm.section}
                        onChange={(e) => setAddForm({ ...addForm, section: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Register Student
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab === 'bulk' && (
            <>
              <div className="card-header">
                <span className="card-title">JSON Bulk Upload Console</span>
              </div>
              <div className="card-body">
                <form onSubmit={handleBulkUpload}>
                  <div className="form-group">
                    <label>Raw JSON Array Input</label>
                    <textarea 
                      rows={10}
                      required
                      placeholder={`[\n  { "name": "Elena Rostova", "email": "elena.r@academia.edu", "percentage": 94.6, "grade": "A", "section": "Sec-1" }\n]`}
                      value={bulkJson}
                      onChange={(e) => setBulkJson(e.target.value)}
                      style={{ fontFamily: 'monospace' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Execute Upload
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab === 'operations' && (
            <div className="card-body operations-grid">
              {/* Quick Email Update */}
              <div className="op-card">
                <div className="op-header">
                  Update Student Email
                </div>
                <form onSubmit={handleUpdateEmail} className="search-form">
                  <input 
                    type="number" 
                    required 
                    placeholder="Student ID" 
                    value={updateEmailForm.id}
                    onChange={(e) => setUpdateEmailForm({ ...updateEmailForm, id: e.target.value })}
                  />
                  <input 
                    type="email" 
                    required 
                    placeholder="New Email" 
                    value={updateEmailForm.email}
                    onChange={(e) => setUpdateEmailForm({ ...updateEmailForm, email: e.target.value })}
                  />
                  <button type="submit" className="btn btn-secondary">Update</button>
                </form>
              </div>

              {/* Auto Grade assigner */}
              <div className="op-card">
                <div className="op-header">
                  Batch Allocate Grade
                </div>
                <form onSubmit={handleUpdateGradesByPercentage} className="search-form">
                  <input 
                    type="number" step="0.01" required placeholder="Min %" 
                    value={gradeUpdateForm.start}
                    onChange={(e) => setGradeUpdateForm({ ...gradeUpdateForm, start: e.target.value })}
                  />
                  <input 
                    type="number" step="0.01" required placeholder="Max %" 
                    value={gradeUpdateForm.end}
                    onChange={(e) => setGradeUpdateForm({ ...gradeUpdateForm, end: e.target.value })}
                  />
                  <input 
                    type="text" required placeholder="Assign Grade (e.g. A)" 
                    value={gradeUpdateForm.grade}
                    onChange={(e) => setGradeUpdateForm({ ...gradeUpdateForm, grade: e.target.value })}
                  />
                  <button type="submit" className="btn btn-secondary">Apply</button>
                </form>
              </div>

              {/* Auto Section assigner */}
              <div className="op-card">
                <div className="op-header">
                  Batch Assign Section
                </div>
                <form onSubmit={handleUpdateSectionByGrade} className="search-form">
                  <input 
                    type="text" required placeholder="Target Grade (e.g. A)" 
                    value={sectionUpdateForm.grade}
                    onChange={(e) => setSectionUpdateForm({ ...sectionUpdateForm, grade: e.target.value })}
                  />
                  <input 
                    type="text" required placeholder="Assign Section (e.g. S1)" 
                    value={sectionUpdateForm.section}
                    onChange={(e) => setSectionUpdateForm({ ...sectionUpdateForm, section: e.target.value })}
                  />
                  <button type="submit" className="btn btn-secondary">Apply</button>
                </form>
              </div>

              {/* Range-based delete */}
              <div className="op-card" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
                <div className="op-header" style={{ color: 'var(--accent-danger)' }}>
                  <AlertCircle size={18} /> Batch Delete by Score Range
                </div>
                <form onSubmit={handleDeleteByPercentage} className="search-form">
                  <input 
                    type="number" step="0.01" required placeholder="Min %" 
                    value={deletePercentageForm.start}
                    onChange={(e) => setDeletePercentageForm({ ...deletePercentageForm, start: e.target.value })}
                  />
                  <input 
                    type="number" step="0.01" required placeholder="Max %" 
                    value={deletePercentageForm.end}
                    onChange={(e) => setDeletePercentageForm({ ...deletePercentageForm, end: e.target.value })}
                  />
                  <button type="submit" className="btn btn-danger">Execute Purge</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
