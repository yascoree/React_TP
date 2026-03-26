import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import Header from '../Components/Header';
import styles from './ProjectDetail.module.css';

interface Project { id: string; name: string; color: string; }

export default function ProjectDetail() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const { state: authState, dispatch } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
      
    // BUG 1 CORRIGÉ : Ajout de 'id' et 'navigate' dans le tableau de dépendances 
  }, [id, navigate]); 

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!project) return null;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => navigate('/dashboard')}
        // BUG 2 CORRIGÉ : Utilisation de l'optional chaining (?.) pour éviter une erreur si l'utilisateur est null 
        userName={authState.user?.name} 
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <main className={styles.main}>
        <div className={styles.header}>
          <span className={styles.dot} style={{ background: project.color }} />
          <h2>{project.name}</h2>
        </div>
        <p className={styles.info}>Projet ID: {project.id}</p>
      </main>
    </div>
  );
}