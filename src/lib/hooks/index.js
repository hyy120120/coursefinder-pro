import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  studentService, courseService, applicationService,
  notificationService,
} from '@/lib/firebase/services';
import { debounce } from '@/lib/utils';

export function useStudents() {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile?.agencyId) return;
    setLoading(true);
    const unsub = studentService.subscribeByAgency(profile.agencyId, (data) => {
      setStudents(data);
      setLoading(false);
      setError(null);
    });
    return unsub;
  }, [profile?.agencyId]);

  const addStudent = useCallback(
    async (data) => {
      if (!profile?.agencyId) throw new Error('Agency ID missing');
      await studentService.create({ ...data, agencyId: profile.agencyId });
    },
    [profile?.agencyId]
  );

  const updateStudent = useCallback(async (id, data) => {
    await studentService.update(id, data);
  }, []);

  const deleteStudent = useCallback(async (id) => {
    await studentService.delete(id);
  }, []);

  return { students, loading, error, addStudent, updateStudent, deleteStudent };
}

export function useCourses(filters = {}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let data = await courseService.list(500);
        
        // Apply filters
        if (filters.country) {
          data = data.filter(c => c.country === filters.country);
        }
        if (filters.field) {
          data = data.filter(c => c.field?.includes(filters.field));
        }
        if (filters.level) {
          data = data.filter(c => c.level === filters.level);
        }
        if (filters.search) {
          const term = filters.search.toLowerCase();
          data = data.filter(c =>
            c.name?.toLowerCase().includes(term) ||
            c.universityName?.toLowerCase().includes(term)
          );
        }
        
        setCourses(data);
      } catch (err) {
        console.error('useCourses error:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  return { courses, loading };
}

export function useApplications() {
  const { profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.agencyId) return;
    const unsub = applicationService.subscribeByAgency(profile.agencyId, (data) => {
      setApplications(data);
      setLoading(false);
    });
    return unsub;
  }, [profile?.agencyId]);

  const createApplication = useCallback(
    async (data) => {
      if (!profile?.agencyId) throw new Error('Agency ID missing');
      await applicationService.create({ ...data, agencyId: profile.agencyId });
    },
    [profile?.agencyId]
  );

  const updateStatus = useCallback(async (id, status) => {
    await applicationService.updateStatus(id, status);
  }, []);

  return { applications, loading, createApplication, updateStatus };
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = notificationService.subscribeUnread(user.uid, (data) => {
      setNotifications(data);
      setUnreadCount(data.length);
    });
    return unsub;
  }, [user?.uid]);

  const markRead = useCallback(async (id) => {
    await notificationService.markRead(id);
  }, []);

  return { notifications, unreadCount, markRead };
}

export function useDebouncedSearch(searchFn, delay = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (q) => {
      if (!q) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchFn(q);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay),
    [searchFn, delay]
  );

  const handleSearch = (q) => {
    setQuery(q);
    debouncedSearch(q);
  };

  return { query, results, loading, handleSearch };
}
