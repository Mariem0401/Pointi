import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TextField, InputAdornment, Button, IconButton, Menu, MenuItem, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Grid, Badge, Tooltip, LinearProgress,
  ListItemIcon
} from '@mui/material';
import {
  Search, FilterList, Download, Print, MoreVert,
  PictureAsPdf, Description, Send, Paid, Mail,
  CheckCircle, PendingActions, Cancel
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import 'moment/locale/fr';

// --- Données d'exemple ---
const samplePaySlips = [
  {
    id: 1,
    employee: {
      name: "Jean Dupont",
      matricule: "EMP001",
      photo: "",
      department: "Développement"
    },
    period: "2023-01-15",
    grossSalary: 4500,
    deductions: 850,
    netSalary: 3650,
    status: "paid",
    paymentDate: "2023-01-30"
  },
  {
    id: 2,
    employee: {
      name: "Marie Martin",
      matricule: "EMP002",
      photo: "",
      department: "RH"
    },
    period: "2023-02-10",
    grossSalary: 4200,
    deductions: 700,
    netSalary: 3500,
    status: "pending",
    paymentDate: null
  },
  {
    id: 3,
    employee: {
      name: "Sami Ben Ali",
      matricule: "EMP003",
      photo: "",
      department: "IT"
    },
    period: "2023-03-20",
    grossSalary: 4800,
    deductions: 600,
    netSalary: 4200,
    status: "paid",
    paymentDate: "2023-03-31"
  },
  {
    id: 4,
    employee: {
      name: "Nadia Lemaire",
      matricule: "EMP004",
      photo: "",
      department: "Marketing"
    },
    period: "2023-04-01",
    grossSalary: 4100,
    deductions: 550,
    netSalary: 3550,
    status: "pending",
    paymentDate: null
  },
  {
    id: 5,
    employee: {
      name: "Karim Ayari",
      matricule: "EMP005",
      photo: "",
      department: "Comptabilité"
    },
    period: "2023-05-05",
    grossSalary: 5000,
    deductions: 750,
    netSalary: 4250,
    status: "paid",
    paymentDate: "2023-05-31"
  }
];

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  textTransform: 'capitalize'
}));

const PaySlips = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedActionSlip, setSelectedActionSlip] = useState(null);

  const [filters, setFilters] = useState({
    status: 'all',
    month: 'all',
    year: 'all', // ✅ corriger ici
    department: 'all'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlips(samplePaySlips);
      setLoading(false);
      console.log("Slips chargés :", samplePaySlips);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
    setPage(0);
    handleFilterMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownload = (format) => {
    alert(`Téléchargement au format ${format}`);
  };

  const handlePreview = (slip) => {
    setSelectedSlip(slip);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleActionMenuOpen = (event, slip) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedActionSlip(slip);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedActionSlip(null);
  };

  const handleMarkAsPaid = () => {
    const updatedSlips = slips.map(slip =>
      slip.id === selectedActionSlip.id
        ? { ...slip, status: 'paid', paymentDate: new Date().toISOString() }
        : slip
    );
    setSlips(updatedSlips);
    handleActionMenuClose();
  };

  const handleSendReminder = () => {
    alert(`Rappel envoyé à ${selectedActionSlip.employee.name}`);
    handleActionMenuClose();
  };

  const filteredSlips = slips.filter(slip => {
    const matchesSearch =
      slip.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.employee.matricule.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === 'all' || slip.status === filters.status;

    const matchesMonth =
      filters.month === 'all' ||
      moment(slip.period).format('M') === filters.month;

    const matchesYear =
      filters.year === 'all' ||
      moment(slip.period).format('YYYY') === filters.year.toString();

    const matchesDepartment =
      filters.department === 'all' ||
      slip.employee.department === filters.department;

    return matchesSearch && matchesStatus && matchesMonth && matchesYear && matchesDepartment;
  });

  const paginatedSlips = filteredSlips.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle color="success" />;
      case 'pending': return <PendingActions color="warning" />;
      case 'cancelled': return <Cancel color="error" />;
      default: return <PendingActions />;
    }
  };

  const departments = [...new Set(slips.map(slip => slip.employee.department))];

  if (loading) return (
    <Box sx={{ width: '100%', p: 3 }}>
      <LinearProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>Chargement des bulletins...</Typography>
    </Box>
  );

  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestion des Bulletins de Paie</Typography>
        
        <Box>
          <Tooltip title="Exporter tous les bulletins">
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<Download />}
              sx={{ mr: 1 }}
            >
              Exporter
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Barre de recherche et filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Rechercher un employé..."
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={handleFilterMenuOpen}
          sx={{ minWidth: 120 }}
        >
          Filtres
          {filters.status !== 'all' || filters.month !== 'all' || filters.department !== 'all' ? (
            <Badge 
              color="primary" 
              variant="dot" 
              invisible={false} 
              sx={{ ml: 1 }}
            />
          ) : null}
        </Button>
        
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
          PaperProps={{ sx: { maxHeight: 400 } }}
        >
          <MenuItem dense disabled>Statut</MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('status', 'all')}
            selected={filters.status === 'all'}
          >
            Tous les statuts
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('status', 'paid')}
            selected={filters.status === 'paid'}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" fontSize="small" />
              Payé
            </Box>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('status', 'pending')}
            selected={filters.status === 'pending'}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PendingActions color="warning" fontSize="small" />
              En attente
            </Box>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem dense disabled>Mois</MenuItem>
          {moment.months().map((month, index) => (
            <MenuItem 
              key={month} 
              onClick={() => handleFilterChange('month', (index + 1).toString())}
              selected={filters.month === (index + 1).toString()}
            >
              {month}
            </MenuItem>
          ))}
          <MenuItem 
            onClick={() => handleFilterChange('month', 'all')}
            selected={filters.month === 'all'}
          >
            Tous les mois
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem dense disabled>Département</MenuItem>
          {departments.map(dept => (
            <MenuItem 
              key={dept} 
              onClick={() => handleFilterChange('department', dept)}
              selected={filters.department === dept}
            >
              {dept}
            </MenuItem>
          ))}
          <MenuItem 
            onClick={() => handleFilterChange('department', 'all')}
            selected={filters.department === 'all'}
          >
            Tous les départements
          </MenuItem>
        </Menu>
      </Box>

      {/* Statistiques rapides */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, flexGrow: 1, minWidth: 200 }}>
          <Typography variant="subtitle2" color="textSecondary">Total bulletins</Typography>
          <Typography variant="h5">{slips.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flexGrow: 1, minWidth: 200 }}>
          <Typography variant="subtitle2" color="textSecondary">Payés ce mois</Typography>
          <Typography variant="h5">
            {slips.filter(s => s.status === 'paid' && moment(s.period).format('M') === moment().format('M')).length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flexGrow: 1, minWidth: 200 }}>
          <Typography variant="subtitle2" color="textSecondary">En attente</Typography>
          <Typography variant="h5" color="warning.main">
            {slips.filter(s => s.status === 'pending').length}
          </Typography>
        </Paper>
      </Box>

      {/* Tableau des bulletins */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Employé</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Matricule</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Département</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Salaire Net</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSlips.length > 0 ? (
              paginatedSlips.map((slip) => (
                <TableRow key={slip.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        src={slip.employee.photo} 
                        alt={slip.employee.name}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Typography>{slip.employee.name}</Typography>
                        {slip.status === 'paid' && slip.paymentDate && (
                          <Typography variant="caption" color="textSecondary">
                            Payé le {moment(slip.paymentDate).format('DD/MM/YYYY')}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{slip.employee.matricule}</TableCell>
                  <TableCell>{slip.employee.department}</TableCell>
                  <TableCell>
                    {moment(slip.period).format('MMMM YYYY')}
                  </TableCell>
                  <TableCell>
                    {slip.netSalary.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      icon={getStatusIcon(slip.status)}
                      label={slip.status === 'paid' ? 'Payé' : 
                            slip.status === 'pending' ? 'En attente' : 'Annulé'}
                      color={slip.status === 'paid' ? 'success' : 
                            slip.status === 'pending' ? 'warning' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Aperçu">
                      <IconButton onClick={() => handlePreview(slip)}>
                        <Description color="info" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Télécharger PDF">
                      <IconButton onClick={() => handleDownload('pdf')}>
                        <PictureAsPdf color="error" />
                      </IconButton>
                    </Tooltip>
                    <IconButton 
                      onClick={(e) => handleActionMenuOpen(e, slip)}
                      aria-label="plus d'actions"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Aucun bulletin trouvé
                  </Typography>
                  {filters.status !== 'all' || filters.month !== 'all' || searchTerm ? (
                    <Button 
                      variant="text" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({
                          status: 'all',
                          month: 'all',
                          year: new Date().getFullYear(),
                          department: 'all'
                        });
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSlips.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
      />

      {/* Menu des actions */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={handleMarkAsPaid} disabled={selectedActionSlip?.status === 'paid'}>
          <ListItemIcon>
            <Paid fontSize="small" />
          </ListItemIcon>
          Marquer comme payé
        </MenuItem>
        <MenuItem onClick={handleSendReminder} disabled={selectedActionSlip?.status === 'paid'}>
          <ListItemIcon>
            <Send fontSize="small" />
          </ListItemIcon>
          Envoyer un rappel
        </MenuItem>
        <MenuItem onClick={() => { handleDownload('excel'); handleActionMenuClose(); }}>
          <ListItemIcon>
            <Description fontSize="small" color="success" />
          </ListItemIcon>
          Exporter en Excel
        </MenuItem>
        <MenuItem onClick={() => { handlePreview(selectedActionSlip); handleActionMenuClose(); }}>
          <ListItemIcon>
            <Description fontSize="small" color="info" />
          </ListItemIcon>
          Aperçu détaillé
        </MenuItem>
      </Menu>

      {/* Dialogue de prévisualisation */}
      <Dialog 
        open={previewOpen} 
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Bulletin de {selectedSlip?.employee.name}
            </Typography>
            <StatusChip
              icon={selectedSlip && getStatusIcon(selectedSlip.status)}
              label={selectedSlip?.status === 'paid' ? 'Payé' : 
                    selectedSlip?.status === 'pending' ? 'En attente' : 'Annulé'}
              color={selectedSlip?.status === 'paid' ? 'success' : 
                    selectedSlip?.status === 'pending' ? 'warning' : 'error'}
              size="medium"
            />
          </Box>
          <Typography variant="subtitle1" color="textSecondary">
            {selectedSlip && moment(selectedSlip.period).format('MMMM YYYY')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedSlip && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Informations employé
                </Typography>
                <Box sx={{ 
                  backgroundColor: 'grey.50', 
                  p: 2, 
                  borderRadius: 1,
                  mb: 2
                }}>
                  <Typography><strong>Nom:</strong> {selectedSlip.employee.name}</Typography>
                  <Typography><strong>Matricule:</strong> {selectedSlip.employee.matricule}</Typography>
                  <Typography><strong>Département:</strong> {selectedSlip.employee.department}</Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Détails de paie
                </Typography>
                <Box sx={{ 
                  backgroundColor: 'grey.50', 
                  p: 2, 
                  borderRadius: 1 
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Salaire brut:</Typography>
                    <Typography fontWeight={500}>
                      {selectedSlip.grossSalary.toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Retenues:</Typography>
                    <Typography fontWeight={500} color="error">
                      -{selectedSlip.deductions.toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1"><strong>Salaire net:</strong></Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedSlip.netSalary.toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Aperçu du bulletin
                </Typography>
                <Box sx={{ 
                  height: 300, 
                  backgroundColor: 'grey.100', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                  <Box textAlign="center">
                    <PictureAsPdf sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography color="textSecondary">Aperçu du PDF du bulletin</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {selectedSlip.employee.name} - {moment(selectedSlip.period).format('MMMM YYYY')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}>
          <Button 
            onClick={handlePreviewClose}
            sx={{ mr: 1 }}
          >
            Fermer
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Mail />}
            sx={{ mr: 1 }}
          >
            Envoyer par email
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Print />}
            onClick={() => window.print()}
            color="secondary"
          >
            Imprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PaySlips;