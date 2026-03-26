import { useState } from 'react';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
  initialName?: string;
  initialColor?: string;
  submitLabel: string;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
}

export default function ProjectForm({ 
  initialName = '', 
  initialColor = '#3498db', 
  submitLabel, 
  onSubmit, 
  onCancel 
}: ProjectFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, color);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Nom du projet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
        autoFocus
        required
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className={styles.colorPicker}
      />
      <button type="submit" className={styles.submit}>{submitLabel}</button>
      <button type="button" onClick={onCancel} className={styles.cancel}>Annuler</button>
    </form>
  );
}
