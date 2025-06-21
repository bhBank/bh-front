import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { resetPassword } from '../services/authService'; // Assurez-vous que le chemin est correct
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [matricule, setMatricule] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
        if(window.confirm("Êtes-vous sûr de vouloir réinitialiser le mot de passe ?")) {
        let resp=await resetPassword(matricule);
        console.log("response",resp);
        if (resp) {
          setSuccess(resp.message);
        }
        else {
          setError('Erreur lors de la réinitialisation du mot de passe');
        }
      }

      
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2, background: 'white' }}>
        <Typography variant="h5" mb={2}>Réinitialiser le mot de passe</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Matricule"
            value={matricule}
            onChange={e => setMatricule(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Envoi...' : 'Réinitialiser'}
          </Button>
        </form>
        <Button variant="text" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>
          Retour à la connexion
        </Button>
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Container>
  );
}

export default ResetPassword;
