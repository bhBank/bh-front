import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAllLogs, getLogsByDateRange, getLogsByUser } from '../services/logService';
import Sidebar from "../components/Sidebar";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'date', 'status'
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let response;
      if (filterType === 'date' && startDate && endDate) {
        response = await getLogsByDateRange(startDate, endDate);
      } else {
        response = await getAllLogs();
      }
      setLogs(response);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = () => {
    fetchLogs();
  };

  const getStatusColor = (status) => {
    return status === 'SUCCESS' ? 'success' : 'error';
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN':
        return '#2196f3';
      case 'LOGOUT':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedStatus === 'all') return true;
    return log.status === selectedStatus;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center" p={3}>
          {error}
        </Typography>
      );
    }

    return (

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Détails</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Navigateur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                  {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: fr })}
                </TableCell>
                <TableCell>
                  {log.user ? log.user.fullname : 'Utilisateur inconnu'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.action}
                    sx={{ bgcolor: getActionColor(log.action), color: 'white' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    color={getStatusColor(log.status)}
                  />
                </TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {log.userAgent}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="container-fluid p-4">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Journaux d'activité
            </Typography>
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Box>

          <Box display="flex" gap={2} mb={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Type de filtre</InputLabel>
              <Select
                value={filterType}
                label="Type de filtre"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">Tous les logs</MenuItem>
                <MenuItem value="date">Par date</MenuItem>
                <MenuItem value="status">Par statut</MenuItem>
              </Select>
            </FormControl>

            {filterType === 'date' && (
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date début"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="Date fin"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            )}

            {filterType === 'status' && (
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Statut"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="SUCCESS">Succès</MenuItem>
                  <MenuItem value="FAILED">Échec</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Logs; 