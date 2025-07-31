import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Box, Typography, Paper, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Button
} from '@mui/material';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const fakeLeaveRequests = [
  {
    id: 1,
    employee: { name: 'Jean Dupont' },
    type: 'Congé payé',
    status: 'approved',
    startDate: '2025-07-15',
    endDate: '2025-07-20',
  },
  {
    id: 2,
    employee: { name: 'Marie Curie' },
    type: 'Maladie',
    status: 'pending',
    startDate: '2025-07-18',
    endDate: '2025-07-19',
  },
  {
    id: 3,
    employee: { name: 'Ahmed Ben Salah' },
    type: 'Télétravail',
    status: 'rejected',
    startDate: '2025-07-22',
    endDate: '2025-07-23',
  },
];

const LeaveCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // État de la vue et de la date du calendrier
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Fixer heures pour afficher les events dans la vue mois
    const formatted = fakeLeaveRequests.map(req => ({
      ...req,
      title: `${req.employee.name} - ${req.type}`,
      start: new Date(req.startDate + 'T09:00:00'),
      end: new Date(req.endDate + 'T17:00:00'),
    }));
    setEvents(formatted);
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#2196f3';
    if (event.status === 'approved') backgroundColor = '#4caf50';
    else if (event.status === 'pending') backgroundColor = '#ff9800';
    else if (event.status === 'rejected') backgroundColor = '#f44336';

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        display: 'block',
        padding: '4px',
      }
    };
  };

  const handleSelectEvent = (event) => setSelectedEvent(event);

  const CustomToolbar = ({ label, onNavigate }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
      <Box mb={1}>
        <Chip
          label="Aujourd'hui"
          onClick={() => {
            const today = new Date();
            setCurrentDate(today);
            onNavigate('TODAY');
          }}
          sx={{ mr: 1 }}
        />
        <Chip
          label="<"
          onClick={() => {
            onNavigate('PREV');
            setCurrentDate(prev => moment(prev).subtract(1, currentView).toDate());
          }}
          sx={{ mr: 1 }}
        />
        <Chip
          label=">"
          onClick={() => {
            onNavigate('NEXT');
            setCurrentDate(prev => moment(prev).add(1, currentView).toDate());
          }}
          sx={{ mr: 1 }}
        />
      </Box>

      <Typography variant="h6">{label}</Typography>

      {/* Boutons Jour et Semaine supprimés */}
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, height: '85vh' }}>
      <Typography variant="h5" gutterBottom>📅 Calendrier des Congés</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', mr: 1 }} />
          <Typography variant="body2">Approuvé</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', mr: 1 }} />
          <Typography variant="body2">En attente</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', mr: 1 }} />
          <Typography variant="body2">Rejeté</Typography>
        </Box>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        view={currentView}
        date={currentDate}
        onView={() => {} /* Blocage pour ne pas changer la vue */}
        onNavigate={(date) => setCurrentDate(date)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month']} // seulement vue mois disponible
        components={{
          toolbar: CustomToolbar,
        }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        messages={{
          today: "Aujourd'hui",
          previous: 'Précédent',
          next: 'Suivant',
          month: 'Mois',
          noEventsInRange: 'Aucun événement.',
        }}
      />

      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle>Détails du congé</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              <Typography><strong>Employé:</strong> {selectedEvent.employee.name}</Typography>
              <Typography><strong>Type:</strong> {selectedEvent.type}</Typography>
              <Typography><strong>Statut:</strong> {selectedEvent.status}</Typography>
              <Typography><strong>Période:</strong> {moment(selectedEvent.start).format('LL')} - {moment(selectedEvent.end).format('LL')}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LeaveCalendar;
