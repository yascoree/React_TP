import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import HeaderMUI from '../Components/HeaderMUI';
import Sidebar from '../Components/Sidebar';
import MainContent from '../Components/MainContent';
import ProjectForm from './Components/ProjectForm';
import styles from './Dashboard.module.css';

interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDangerousTest, setShowDangerousTest] = useState(false); // TEST XSS

  // GET: Charger les données au montage [cite: 113]
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (e) {
        console.error("Erreur de chargement", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // POST: Ajouter un projet [cite: 127]
  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects(prev => [...prev, data]);
      setShowForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }

  // PUT: Renommer un projet (Partie 4.3) [cite: 171]
  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom:', project.name); // [cite: 172]
    
    if (newName && newName !== project.name) { // [cite: 173]
      setSaving(true);
      setError(null);
      try {
        const { data } = await api.put(`/projects/${project.id}`, { 
          ...project, 
          name: newName 
        }); // [cite: 174]
        
        // Mise à jour locale du state [cite: 175]
        setProjects(prev => prev.map(p => p.id === project.id ? data : p));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
        } else {
          setError('Erreur inconnue');
        }
      } finally {
        setSaving(false);
      }
    }
  }

  // DELETE: Supprimer un projet (Partie 4.4) [cite: 177]
  async function deleteProject(id: string) {
    if (confirm('Êtes-vous sûr ?')) { // [cite: 178]
      setSaving(true);
      setError(null);
      try {
        await api.delete(`/projects/${id}`); // [cite: 179]
        // Mise à jour locale en filtrant [cite: 180]
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
        } else {
          setError('Erreur inconnue');
        }
      } finally {
        setSaving(false);
      }
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  // ========== TEST XSS - PARTIE 1.1 & 1.2 ==========
  //  C'est du code de TEST, à SUPPRIMER après
  //const dangerousName = '<img src=x onerror=alert("HACK")>';
  // ================================================

  return (
    <div className={styles.layout}>
      <HeaderMUI
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div className={styles.body}>
        <Sidebar 
          projects={projects} 
          isOpen={sidebarOpen}
        />
        <div className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.toolbar}>
            {!showForm ? (
              <button 
                className={styles.addBtn} 
                onClick={() => setShowForm(true)}
                disabled={saving}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={(name, color) => {
                  addProject(name, color);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
         
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}