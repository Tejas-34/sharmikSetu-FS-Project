const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
};

export const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    name: user.full_name,
    phoneNumber: user.phone_number || '',
    bio: user.bio || '',
    latitude: user.latitude,
    longitude: user.longitude,
    isVerified: Boolean(user.is_verified),
    verificationDocumentType: user.verification_document_type || '',
    verificationDocumentId: user.verification_document_id || '',
  };
};

export const normalizeJob = (job) => ({
  id: job.id,
  title: job.title,
  description: job.description,
  employerId: job.employer?.id,
  employerName: job.employer?.full_name || 'Unknown employer',
  employerEmail: job.employer?.email || '',
  employerPhone: job.employer?.phone_number || '',
  location: job.site_city || job.employer?.city || 'City not provided',
  employerCity: job.employer?.city || '',
  siteAddress: job.site_address || '',
  siteCity: job.site_city || '',
  siteLatitude: job.site_latitude,
  siteLongitude: job.site_longitude,
  wage: Number(job.daily_wage),
  requiredWorkers: job.required_workers,
  filledSlots: job.filled_slots,
  availableSlots: job.available_slots,
  skillsRequired: job.skills_required || [],
  startDate: job.start_date || null,
  deadline: job.deadline || null,
  daysRemaining: typeof job.days_remaining === 'number' ? job.days_remaining : null,
  postedAt: job.created_at,
  status: String(job.status || '').toUpperCase(),
  appliedWorkers: job.applied_workers || [],
  applicants: (job.applicants || []).map((applicant) => ({
    applicationId: applicant.application_id,
    id: applicant.id,
    name: applicant.full_name,
    email: applicant.email,
    phoneNumber: applicant.phone_number || '',
    city: applicant.city,
    is_verified: applicant.is_verified,
    averageRating: applicant.average_rating,
    reviewsCount: applicant.reviews_count,
    certificateCount: applicant.certificate_count,
    status: applicant.status,
  })),
  myApplicationStatus: job.my_application_status,
});

export const ensureCsrf = async () => {
  await fetch(`${API_BASE}/auth/csrf`, {
    credentials: 'include',
  });
};

export const apiFetch = async (path, options = {}) => {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});
  const isJsonBody = options.body && !(options.body instanceof FormData);

  if (isJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body: isJsonBody ? JSON.stringify(options.body) : options.body,
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.detail ||
      data?.message ||
      Object.values(data || {}).flat().join(' ') ||
      'Request failed';
    throw new Error(message);
  }

  return data;
};
