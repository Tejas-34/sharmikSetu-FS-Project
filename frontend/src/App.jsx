import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

import { TRANSLATIONS } from './i18n/translations';
import { WORKER_RIGHTS, EMPLOYER_LAWS } from './constants';
import { apiFetch, ensureCsrf, normalizeJob, normalizeUser } from './utils/api';
import { getErrorMessage } from './utils/messages';

import ConfirmModal from './components/modals/ConfirmModal';
import AlertModal from './components/modals/AlertModal';
import LawModal from './components/modals/LawModal';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppShell from './components/layout/AppShell';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import TutorialPage from './components/pages/TutorialPage';
import LoginForm from './components/forms/LoginForm';
import ProfileView from './components/forms/ProfileView';
import CompleteProfileForm from './components/forms/CompleteProfileForm';
import CreateJobForm from './components/forms/CreateJobForm';
import Dashboard from './components/dashboard/Dashboard';
import JobsPage from './components/dashboard/JobsPage';
import CertificatesPage from './components/dashboard/CertificatesPage';
import CalendarPage from './components/dashboard/CalendarPage';
import ApplicantsPage from './components/dashboard/ApplicantsPage';
import WorkerAvailabilityPage from './components/dashboard/WorkerAvailabilityPage';
import MessagingPage from './components/dashboard/MessagingPage';

const APP_ROUTES = ['/app/dashboard', '/app/jobs', '/app/jobs/new', '/app/profile', '/app/certificates', '/app/calendar', '/app/applicants', '/app/worker-availability', '/app/complete-profile', '/app/messages'];

const getInitialPath = () => window.location.pathname || '/';

export default function App() {
  const [currentPath, setCurrentPath] = useState(getInitialPath);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [taskHistory, setTaskHistory] = useState({ ongoing: [], completed: [] });
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [toast, setToast] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
  });

  const [blockingError, setBlockingError] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const [workerLawModal, setWorkerLawModal] = useState({
    isOpen: false,
    pendingJobId: null,
  });
  const [showEmployerLawInfo, setShowEmployerLawInfo] = useState(false);

  const t = (key) => TRANSLATIONS.en[key] || key;
  const isAppRoute = APP_ROUTES.some((route) => currentPath.startsWith(route));
  const resolvedPath = !currentUser && isAppRoute ? '/login' : currentPath;
  const isResolvedAppRoute = APP_ROUTES.some((route) => resolvedPath.startsWith(route));

  const navigate = (path, replace = false) => {
    if (path === currentPath) return;
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJobs = async () => {
    try {
      const data = await apiFetch('/jobs/');
      setJobs((data?.results || data || []).map(normalizeJob));
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      showToast(getErrorMessage(error, 'Could not connect to server'), 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/users/');
      setUsers((data?.results || data || []).map(normalizeUser));
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const data = await apiFetch('/dashboard/summary');
      setDashboardSummary(data);
    } catch {
      setDashboardSummary(null);
    }
  };

  const fetchTaskHistory = async () => {
    try {
      const data = await apiFetch('/applications/tasks');
      setTaskHistory(data);
    } catch {
      setTaskHistory({ ongoing: [], completed: [] });
    }
  };

  const fetchCalendarEntries = async () => {
    try {
      const data = await apiFetch('/calendar/');
      setCalendarEntries(data?.results || data || []);
    } catch {
      setCalendarEntries([]);
    }
  };

  const fetchCertificates = async () => {
    try {
      const data = await apiFetch('/certificates/');
      setCertificates(data?.results || data || []);
    } catch {
      setCertificates([]);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await ensureCsrf();

        try {
          const authData = await apiFetch('/auth/status');
          const user = normalizeUser(authData.user);
          setCurrentUser(user);
          const jobsData = await apiFetch('/jobs/');
          setJobs((jobsData?.results || jobsData || []).map(normalizeJob));

          if (user.role === 'admin') {
            const usersData = await apiFetch('/users/');
            setUsers((usersData?.results || usersData || []).map(normalizeUser));
            setDashboardSummary(null);
            setTaskHistory({ ongoing: [], completed: [] });
            setCalendarEntries([]);
            setCertificates([]);
          } else {
            try {
              const summaryData = await apiFetch('/dashboard/summary');
              setDashboardSummary(summaryData);
            } catch {
              setDashboardSummary(null);
            }

            try {
              const certificateData = await apiFetch('/certificates/');
              setCertificates(certificateData?.results || certificateData || []);
            } catch {
              setCertificates([]);
            }

            if (user.role === 'worker') {
              try {
                const taskData = await apiFetch('/applications/tasks');
                setTaskHistory(taskData);
              } catch {
                setTaskHistory({ ongoing: [], completed: [] });
              }

              try {
                const calendarData = await apiFetch('/calendar/');
                setCalendarEntries(calendarData?.results || calendarData || []);
              } catch {
                setCalendarEntries([]);
              }
            } else {
              setTaskHistory({ ongoing: [], completed: [] });
              setCalendarEntries([]);
            }
          }

          if (window.location.pathname === '/login' || window.location.pathname.startsWith('/auth/google/success')) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('requires_completion') === 'true') {
              window.history.replaceState({}, '', '/app/complete-profile');
              setCurrentPath('/app/complete-profile');
            } else {
              window.history.replaceState({}, '', '/app/dashboard');
              setCurrentPath('/app/dashboard');
              if (window.location.pathname.startsWith('/auth/google/success')) {
                showToast('Google login successful');
              }
            }
          }
        } catch {
          setCurrentUser(null);
          if (APP_ROUTES.some((route) => window.location.pathname.startsWith(route)) || window.location.pathname.startsWith('/auth/google/')) {
            window.history.replaceState({}, '', '/login');
            setCurrentPath('/login');
            if (window.location.pathname.startsWith('/auth/google/error')) {
              showToast('Google authentication failed', 'error');
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize app', error);
        showToast('Could not connect to Python backend', 'error');
      }
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      const user = normalizeUser(data.user);
      setCurrentUser(user);
      await fetchJobs();
      if (user.role === 'admin') {
        await fetchUsers();
        setDashboardSummary(null);
        setTaskHistory({ ongoing: [], completed: [] });
        setCalendarEntries([]);
        setCertificates([]);
      } else {
        await fetchDashboardSummary();
        await fetchCertificates();
        if (user.role === 'worker') {
          await fetchTaskHistory();
          await fetchCalendarEntries();
        } else {
          setTaskHistory({ ongoing: [], completed: [] });
          setCalendarEntries([]);
        }
      }
      navigate('/app/dashboard');
      showToast(`${t('welcome')}, ${user.name}`);
    } catch (error) {
      showToast(getErrorMessage(error, 'Login failed'), 'error');
    }
  };

  const register = async (userData) => {
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: userData,
      });
      await login(userData.email, userData.password);
      showToast('Account created successfully');
    } catch (error) {
      showToast(getErrorMessage(error, 'Registration failed'), 'error');
    }
  };

  const confirmLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: t('modalConfirmLogout'),
      message: t('modalConfirmLogoutMsg'),
      action: async () => {
        try {
          await apiFetch('/auth/logout', { method: 'POST' });
        } catch {
          // Clear local state even if backend session is already gone.
        }
        setCurrentUser(null);
        setUsers([]);
        setJobs([]);
        setDashboardSummary(null);
        setTaskHistory({ ongoing: [], completed: [] });
        setCalendarEntries([]);
        setCertificates([]);
        navigate('/');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Logged out successfully');
      },
    });
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const data = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: updatedData,
      });
      const user = normalizeUser(data.user);
      setCurrentUser(user);
      await fetchDashboardSummary();
      navigate('/app/dashboard');
      showToast('Profile updated successfully');
    } catch (error) {
      showToast(getErrorMessage(error, 'Profile update failed'), 'error');
    }
  };

  const triggerDeleteJob = (jobId) => {
    setConfirmDialog({
      isOpen: true,
      title: t('modalDeleteJob'),
      message: t('modalDeleteJobMsg'),
      action: async () => {
        try {
          await apiFetch(`/jobs/${jobId}/`, { method: 'DELETE' });
          setJobs((prev) => prev.filter((job) => job.id !== jobId));
          showToast('Job deleted successfully.');
        } catch (error) {
          showToast(getErrorMessage(error, 'Failed to delete job'), 'error');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const triggerDeleteUser = (userId) => {
    setConfirmDialog({
      isOpen: true,
      title: t('modalDeleteUser'),
      message: t('modalDeleteUserMsg'),
      action: async () => {
        try {
          await apiFetch(`/users/${userId}/`, { method: 'DELETE' });
          setUsers((prev) => prev.filter((user) => user.id !== userId));
          await fetchJobs();
          showToast('User removed.');
        } catch (error) {
          showToast(getErrorMessage(error, 'Failed to delete user'), 'error');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const createJob = async (jobData) => {
    try {
      await apiFetch('/jobs/', {
        method: 'POST',
        body: {
          title: jobData.title,
          description: jobData.description,
          daily_wage: jobData.wage,
          required_workers: jobData.requiredWorkers,
          skills_required: jobData.skillsRequired,
          site_address: jobData.siteAddress,
          site_city: jobData.siteCity,
          site_latitude: jobData.siteLatitude,
          site_longitude: jobData.siteLongitude,
          start_date: jobData.startDate || null,
          deadline: jobData.deadline || null,
        },
      });

      await fetchJobs();
      navigate('/app/dashboard');
      showToast('Job posted successfully!');
    } catch (error) {
      showToast(getErrorMessage(error, 'Failed to post job'), 'error');
    }
  };

  const initiateApplyForJob = (jobId) => {
    const job = jobs.find((entry) => entry.id === jobId);
    if (!job) return;

    if (job.status === 'CLOSED' || job.appliedWorkers.includes(currentUser.id)) {
      applyForJob(jobId);
      return;
    }

    setWorkerLawModal({ isOpen: true, pendingJobId: jobId });
  };

  const applyForJob = async (jobId) => {
    setWorkerLawModal({ isOpen: false, pendingJobId: null });

    try {
      await apiFetch(`/jobs/${jobId}/apply/`, {
        method: 'POST',
      });
      await fetchJobs();
      showToast('Application submitted successfully!');
    } catch (error) {
      showToast(getErrorMessage(error, 'Application failed'), 'error');
    }
  };

  const createCalendarEntry = async (entryData) => {
    try {
      await apiFetch('/calendar/', {
        method: 'POST',
        body: entryData,
      });
      await fetchCalendarEntries();
      showToast('Calendar entry added');
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not add calendar entry'), 'error');
    }
  };

  const markJobCompleted = async (jobId) => {
    try {
      await apiFetch(`/jobs/${jobId}/complete`, {
        method: 'POST',
      });
      await fetchJobs();
      await fetchCertificates();
      await fetchDashboardSummary();
      showToast('Job marked complete and certificates issued');
    } catch (error) {
      showToast(getErrorMessage(error, 'Could not complete job'), 'error');
    }
  };

  const removeWorker = (jobId, workerId) => {
    setConfirmDialog({
      isOpen: true,
      title: t('modalRemoveWorker'),
      message: t('modalRemoveWorkerMsg'),
      confirmText: t('btnYesRemove'),
      cancelText: t('cancel'),
      action: async () => {
        try {
          await apiFetch(`/jobs/${jobId}/applications/${workerId}`, {
            method: 'DELETE',
          });
          await fetchJobs();
          showToast('Worker removed from job.');
        } catch (error) {
          showToast(getErrorMessage(error, 'Failed to remove worker'), 'error');
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const renderPublicRoute = () => {
    if (resolvedPath === '/about') {
      return <AboutPage t={t} />;
    }

    if (resolvedPath === '/tutorial') {
      return <TutorialPage navigate={navigate} />;
    }

    if (resolvedPath === '/login') {
      return (
        <div className="flex items-center justify-center p-4">
          <LoginForm login={login} register={register} t={t} />
        </div>
      );
    }

    return <HomePage navigate={navigate} t={t} />;
  };

  const renderAppRoute = () => {
    if (!currentUser) return null;

    if (resolvedPath === '/app/profile') {
      return (
        <ProfileView
          currentUser={currentUser}
          updateUserProfile={updateUserProfile}
          navigate={navigate}
          taskHistory={taskHistory}
          certificates={certificates}
          calendarEntries={calendarEntries}
          createCalendarEntry={createCalendarEntry}
        />
      );
    }

    if (resolvedPath === '/app/complete-profile') {
      return (
        <CompleteProfileForm 
          currentUser={currentUser}
          completeProfile={async (data) => {
            try {
              await apiFetch('/auth/google/complete', {
                method: 'POST',
                body: data,
              });
              const authData = await apiFetch('/auth/status');
              setCurrentUser(normalizeUser(authData.user));
              window.history.replaceState({}, '', '/app/dashboard');
              setCurrentPath('/app/dashboard');
              showToast('Profile completed successfully!');
            } catch (error) {
              showToast(getErrorMessage(error, 'Profile completion failed'), 'error');
            }
          }}
        />
      );
    }

    if (resolvedPath === '/app/jobs') {
      return (
        <JobsPage
          currentUser={currentUser}
          jobs={jobs}
          navigate={navigate}
          t={t}
          initiateApplyForJob={initiateApplyForJob}
          triggerDeleteJob={triggerDeleteJob}
          removeWorker={removeWorker}
          updateApplicationStatus={async (applicationId, status) => {
            try {
              await apiFetch('/applications/status', {
                method: 'PUT',
                body: { application_id: applicationId, status },
              });
              showToast(`Application ${status}`);
              await fetchJobs();
            } catch (error) {
              showToast(getErrorMessage(error, 'Update failed'), 'error');
            }
          }}
          markJobCompleted={markJobCompleted}
        />
      );
    }

    if (resolvedPath === '/app/jobs/new') {
      return (
        <CreateJobForm
          currentUser={currentUser}
          createJob={createJob}
          navigate={navigate}
          t={t}
          showToast={showToast}
          setBlockingError={setBlockingError}
          setShowEmployerLawInfo={setShowEmployerLawInfo}
        />
      );
    }

    if (resolvedPath === '/app/certificates') {
      return <CertificatesPage certificates={certificates} fetchCertificates={fetchCertificates} />;
    }

    if (resolvedPath === '/app/calendar') {
      return <CalendarPage calendarEntries={calendarEntries} fetchCalendarEntries={fetchCalendarEntries} />;
    }

    if (resolvedPath === '/app/worker-availability') {
      return <WorkerAvailabilityPage />;
    }

    if (resolvedPath === '/app/messages') {
      return <MessagingPage currentUser={currentUser} />;
    }

    if (resolvedPath === '/app/applicants') {
      return (
        <ApplicantsPage
          jobs={jobs}
          currentUser={currentUser}
          navigate={navigate}
          updateApplicationStatus={async (applicationId, status) => {
            try {
              await apiFetch('/applications/status', {
                method: 'PUT',
                body: { application_id: applicationId, status },
              });
              showToast(`Application ${status}`);
              await fetchJobs();
            } catch (error) {
              showToast(getErrorMessage(error, 'Update failed'), 'error');
            }
          }}
          removeWorker={removeWorker}
        />
      );
    }

    return (
      <Dashboard
        currentUser={currentUser}
        jobs={jobs}
        users={users}
        triggerDeleteUser={triggerDeleteUser}
        dashboardSummary={dashboardSummary}
        taskHistory={taskHistory}
        certificates={certificates}
        calendarEntries={calendarEntries}
        navigate={navigate}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {toast && (
        <div className={`fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl px-6 py-3 shadow-2xl ${
          toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <AlertModal
        isOpen={blockingError.isOpen}
        title={blockingError.title}
        message={blockingError.message}
        btnText={t('btnOkay')}
        onClose={() => setBlockingError({ ...blockingError, isOpen: false })}
      />

      <LawModal
        isOpen={workerLawModal.isOpen}
        title={t('rightsTitle')}
        items={WORKER_RIGHTS}
        buttonText={t('rightsBtn')}
        onConfirm={() => applyForJob(workerLawModal.pendingJobId)}
        onCancel={() => setWorkerLawModal({ isOpen: false, pendingJobId: null })}
      />

      <LawModal
        isOpen={showEmployerLawInfo}
        title={t('respTitle')}
        items={EMPLOYER_LAWS}
        buttonText={t('respBtn')}
        onConfirm={() => setShowEmployerLawInfo(false)}
        onCancel={() => setShowEmployerLawInfo(false)}
      />

      {isResolvedAppRoute && currentUser ? (
        <AppShell
          currentUser={currentUser}
          currentPath={resolvedPath}
          navigate={navigate}
          confirmLogout={confirmLogout}
        >
          {renderAppRoute()}
        </AppShell>
      ) : (
        <>
          <Navbar currentPath={resolvedPath} navigate={navigate} t={t} />
          <main>{renderPublicRoute()}</main>
          <Footer navigate={navigate} t={t} />
        </>
      )}
    </div>
  );
}
