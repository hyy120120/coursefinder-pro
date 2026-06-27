import { db } from './config';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, addDoc,
  serverTimestamp, arrayUnion, onSnapshot,
} from 'firebase/firestore';

// ──── USER SERVICE ────────────────────────────────────────────────────────
export const userService = {
  async get(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
      console.error('userService.get error:', err);
      throw new Error(`Failed to fetch user: ${err.message}`);
    }
  },

  async create(uid, data) {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('userService.create error:', err);
      throw new Error(`Failed to create user: ${err.message}`);
    }
  },

  async update(uid, data) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('userService.update error:', err);
      throw new Error(`Failed to update user: ${err.message}`);
    }
  },
};

// ──── AGENCY SERVICE ────────────────────────────────────────────────────────
export const agencyService = {
  async get(agencyId) {
    try {
      const snap = await getDoc(doc(db, 'agencies', agencyId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
      console.error('agencyService.get error:', err);
      throw new Error(`Failed to fetch agency: ${err.message}`);
    }
  },

  async create(agencyId, data) {
    try {
      await setDoc(doc(db, 'agencies', agencyId), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('agencyService.create error:', err);
      throw new Error(`Failed to create agency: ${err.message}`);
    }
  },

  async update(agencyId, data) {
    try {
      await updateDoc(doc(db, 'agencies', agencyId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('agencyService.update error:', err);
      throw new Error(`Failed to update agency: ${err.message}`);
    }
  },
};

// ──── STUDENT SERVICE ────────────────────────────────────────────────────────
export const studentService = {
  async get(studentId) {
    try {
      const snap = await getDoc(doc(db, 'students', studentId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
      console.error('studentService.get error:', err);
      throw new Error(`Failed to fetch student: ${err.message}`);
    }
  },

  async listByAgency(agencyId) {
    try {
      const q = query(collection(db, 'students'), where('agencyId', '==', agencyId));
      const snaps = await getDocs(q);
      return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('studentService.listByAgency error:', err);
      throw new Error(`Failed to fetch students: ${err.message}`);
    }
  },

  async create(data) {
    try {
      const docRef = await addDoc(collection(db, 'students'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error('studentService.create error:', err);
      throw new Error(`Failed to create student: ${err.message}`);
    }
  },

  async update(studentId, data) {
    try {
      await updateDoc(doc(db, 'students', studentId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('studentService.update error:', err);
      throw new Error(`Failed to update student: ${err.message}`);
    }
  },

  async delete(studentId) {
    try {
      await deleteDoc(doc(db, 'students', studentId));
    } catch (err) {
      console.error('studentService.delete error:', err);
      throw new Error(`Failed to delete student: ${err.message}`);
    }
  },

  subscribeByAgency(agencyId, callback) {
    try {
      const q = query(collection(db, 'students'), where('agencyId', '==', agencyId));
      return onSnapshot(q, (snaps) => {
        const students = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(students);
      }, (err) => {
        console.error('studentService subscription error:', err);
      });
    } catch (err) {
      console.error('studentService.subscribeByAgency error:', err);
      throw new Error(`Failed to subscribe to students: ${err.message}`);
    }
  },
};

// ──── COURSE SERVICE ────────────────────────────────────────────────────────
export const courseService = {
  async get(courseId) {
    try {
      const snap = await getDoc(doc(db, 'courses', courseId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
      console.error('courseService.get error:', err);
      throw new Error(`Failed to fetch course: ${err.message}`);
    }
  },

  async list(limit = 100) {
    try {
      const q = query(collection(db, 'courses'));
      const snaps = await getDocs(q);
      return snaps.docs.slice(0, limit).map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('courseService.list error:', err);
      throw new Error(`Failed to fetch courses: ${err.message}`);
    }
  },
};

// ──── APPLICATION SERVICE ────────────────────────────────────────────────────
export const applicationService = {
  async get(applicationId) {
    try {
      const snap = await getDoc(doc(db, 'applications', applicationId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
      console.error('applicationService.get error:', err);
      throw new Error(`Failed to fetch application: ${err.message}`);
    }
  },

  async listByAgency(agencyId) {
    try {
      const q = query(collection(db, 'applications'), where('agencyId', '==', agencyId));
      const snaps = await getDocs(q);
      return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('applicationService.listByAgency error:', err);
      throw new Error(`Failed to fetch applications: ${err.message}`);
    }
  },

  async create(data) {
    try {
      const docRef = await addDoc(collection(db, 'applications'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error('applicationService.create error:', err);
      throw new Error(`Failed to create application: ${err.message}`);
    }
  },

  async updateStatus(applicationId, status) {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('applicationService.updateStatus error:', err);
      throw new Error(`Failed to update application: ${err.message}`);
    }
  },

  subscribeByAgency(agencyId, callback) {
    try {
      const q = query(collection(db, 'applications'), where('agencyId', '==', agencyId));
      return onSnapshot(q, (snaps) => {
        const apps = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(apps);
      }, (err) => {
        console.error('applicationService subscription error:', err);
      });
    } catch (err) {
      console.error('applicationService.subscribeByAgency error:', err);
      throw new Error(`Failed to subscribe to applications: ${err.message}`);
    }
  },
};

// ──── NOTIFICATION SERVICE ────────────────────────────────────────────────────
export const notificationService = {
  async listUnread(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      const snaps = await getDocs(q);
      return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('notificationService.listUnread error:', err);
      return [];
    }
  },

  subscribeUnread(userId, callback) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      return onSnapshot(q, (snaps) => {
        const notifs = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(notifs);
      });
    } catch (err) {
      console.error('notificationService.subscribeUnread error:', err);
    }
  },

  async markRead(notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch (err) {
      console.error('notificationService.markRead error:', err);
    }
  },
};
