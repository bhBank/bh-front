import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Divider,
    Container,
    CircularProgress
} from '@mui/material';
import { getAgencesWithChefs } from '../services/agenceService';
import { AccountCircle, LocationOn, Business } from '@mui/icons-material';
import Sidebar from "../components/Sidebar";

const AgencesChefs = () => {
    const [agences, setAgences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgences = async () => {
            try {
                const response = await getAgencesWithChefs();
                console.log('Response from API:', response);
                setAgences(response || []);
                setLoading(false);
            } catch (err) {
                console.error('Erreur détaillée:', err);
                setError('Erreur lors du chargement des agences');
                setLoading(false);
            }
        };

        fetchAgences();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <Typography color="error">{error}</Typography>
                </Box>
            );
        }

        if (!agences || agences.length === 0) {
            return (
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Typography variant="h6" align="center">
                        Aucune agence trouvée
                    </Typography>
                </Container>
            );
        }

        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                    Liste des Agences et leurs Chefs
                </Typography>

                <Grid container spacing={3}>
                    {agences.map((agence) => (
                        <Grid item xs={12} md={6} key={agence._id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: 6,
                                        transition: 'box-shadow 0.3s ease-in-out'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Business color="primary" />
                                            {agence.nom || 'Nom non disponible'}
                                        </Typography>
                                        <Typography color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                            <LocationOn fontSize="small" />
                                            {agence.ville?.nom || 'Ville non spécifiée'}
                                            {agence.ville?.gouvernorat?.nom ? `, ${agence.ville.gouvernorat.nom}` : ''}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: agence.chefAgence ? 'primary.main' : 'grey.400' }}>
                                            <AccountCircle />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1">
                                                Chef d'agence
                                            </Typography>
                                            {agence.chefAgence ? (
                                                <Typography>
                                                    {agence.chefAgence.fullname}
                                                </Typography>
                                            ) : (
                                                <Typography color="text.secondary" fontStyle="italic">
                                                    Aucun chef assigné
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="container-fluid p-4">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AgencesChefs; 