import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridRowModes,
  QuickFilter,
} from '@mui/x-data-grid';
import { faker } from '@faker-js/faker';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
function TableActions(props) {
  const {
    rows,
    setRows,
    rowModesModel,
    setRowModesModel,
    selectionModel,
    hasChanges,
    handleOpenConfirmSave,
    onAddClick,
    onOpenDeleteConfirm,
    onOpenEditDialog,
  } = props;

  const selectedRowId = selectionModel.length === 1 ? selectionModel[0] : null;
  const isInEditMode = selectedRowId ? rowModesModel[selectedRowId]?.mode === GridRowModes.Edit : false;
  
  const handleEditClick = () => {
    if (selectedRowId) {
      const rowToEdit = rows.find((row) => row.id === selectedRowId);
      if (rowToEdit) {
        onOpenEditDialog(rowToEdit);
      }
    }
  };
  console.log(selectionModel.length)
  const handleSaveClick = () => {
    if (selectedRowId) {
      setRowModesModel({ ...rowModesModel, [selectedRowId]: { mode: GridRowModes.View } });
    }
  };


  const handleDeleteClick = () => {
    onOpenDeleteConfirm();
  };

  const handleCancelClick = () => {
    if (selectedRowId) {
      setRowModesModel({
        ...rowModesModel,
        [selectedRowId]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = rows.find((row) => row.id === selectedRowId);
      if (editedRow && editedRow.isNew) {
        setRows(rows.filter((row) => row.id !== selectedRowId));
      }
    }
  };

  return (
    <Toolbar sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" component="div">
        Quản lý ca làm việc
      </Typography>
      <Box>
        {!isInEditMode ? (
          <>
            <Button
              startIcon={<SaveIcon/>}
              color="success"
              onClick={handleOpenConfirmSave}
              disabled={!hasChanges}
            >
              Lưu thay đổi
            </Button>
            <Button startIcon={<AddIcon />} onClick={onAddClick} sx={{ mr: 1 }}>
              Thêm ca thi
            </Button>
            <Button
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              disabled={selectionModel.length!==1}
              sx={{ mr: 1 }}
            >
              Cập nhật
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
              disabled={selectionModel.length === 0}
              color="error"
            >
              Xóa
            </Button>
          </>
        ) : (
          <>
            <Button startIcon={<SaveIcon />} onClick={handleSaveClick} sx={{ mr: 1 }}>
              Lưu
            </Button>
            <Button startIcon={<CancelIcon />} onClick={handleCancelClick} color="warning">
              Hủy
            </Button>
          </>
        )}
      </Box>
    </Toolbar>
  );
}

export default function DatTable({ rows, setRows }) {
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editingRowData, setEditingRowData] = React.useState(null);
  const [originalRows, setOriginalRows] = React.useState(rows);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [openConfirmSaveDialog, setOpenConfirmSaveDialog] = React.useState(false);
  const [addDialogErrors, setAddDialogErrors] = React.useState({});
  const handleOpenConfirmSave = () => setOpenConfirmSaveDialog(true);
  const handleCloseConfirmSave = () => setOpenConfirmSaveDialog(false);
  const handleConfirmSave = () => {
    // Gọi API tại đây nếu cần
    setOriginalRows(rows);
    setHasChanges(false);
    setOpenConfirmSaveDialog(false);
  };
  const validateNewRowData = (data) => {
    const errors = {};
    if (!data.ca || data.ca.trim() === "") errors.ca = "Vui lòng nhập ca";
    if (!data.shift || data.shift.trim() === "") errors.shift = "Vui lòng chọn buổi";
    if (!data.time || data.time.trim() === "") errors.time = "Vui lòng nhập thời gian";
    if (!data.date) errors.date = "Vui lòng chọn ngày";
    if (!data.location || data.location.trim() === "") errors.location = "Vui lòng nhập địa điểm";
    return errors;
  };
  React.useEffect(() => {
    const isChanged = JSON.stringify(rows) !== JSON.stringify(originalRows);
    setHasChanges(isChanged);
  }, [rows, originalRows]);

  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [newRowData, setNewRowData] = React.useState({
    shift: '',
    ca : '',
    time: '',
    date: dayjs('DD/MM/YYYY'),
    location: '',
  });

  const handleRowEditStop = (params, event) => {
    if (params.reason === 'rowFocusOut') {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = {
      ...newRow,
      isNew: false,
      date: newRow.date,
    };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleAddClick = () => {
    setNewRowData({
      shift: '',
      time: '',
      date: dayjs('DD/MM/YYYY'),
      location: '',
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewRowData({
      ca: '',
      shift: '',
      time: '',
      date: dayjs('DD/MM/YYYY'),
      location: '',
    });
    setAddDialogErrors({})
  };

  const handleAddDialogChange = (field, value) => {
    console.log(typeof newRowData.date === 'string')
    setNewRowData({ ...newRowData, [field]: value });
  };

  const handleSaveAddDialog = () => {
    const errors = validateNewRowData(newRowData);
    setAddDialogErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Có lỗi, không thêm
      return;
    }
    const id = faker.string.uuid();
    const rowToAdd = {
      id,
      ...newRowData,
      isNew: false,
      date: newRowData.date instanceof Date ? newRowData.date : new Date(newRowData.date),
    };
    setRows((oldRows) => [rowToAdd, ...oldRows]);
    handleCloseAddDialog();
    setAddDialogErrors({}); // clear lỗi sau khi thêm thành công
  };


  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = () => {
    setRows(rows.filter((row) => !selectionModel.includes(row.id)));
    setSelectionModel([]);
    handleCloseDeleteConfirm();
  };

  const handleOpenEditDialog = (row) => {
    setEditingRowData(row);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingRowData(null);
  };

  const handleEditDialogChange = (field, value) => {
    if (editingRowData) {
      setEditingRowData({ ...editingRowData, [field]: value });
    }
  };

  const handleSaveEditDialog = () => {
    if (editingRowData) {
      processRowUpdate(editingRowData);
      handleCloseEditDialog();
    }
  };

  const columns = [
    { field: 'shift', headerName: 'Buổi', width: 150, editable: false },
    { field: 'ca', headerName: 'Ca', width: 150, editable: false },
    { field: 'time', headerName: 'Thời gian', width: 180, editable: false },
    {
      field: 'date',
      headerName: 'Ngày',
      type: 'date',
      width: 150,
      editable: false
    },
    { field: 'location', headerName: 'Địa điểm', width: 200, editable: false },
  ];
  const paginationModel = { page: 0, pageSize: 5 }; 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ px: 0, minHeight: 350, width: '100%' }}>
        <TableActions
          rows={rows}
          setRows={setRows}
          rowModesModel={rowModesModel}
          setRowModesModel={setRowModesModel}
          selectionModel={selectionModel}
          setSelectionModel={setSelectionModel}
          onAddClick={handleAddClick}
          onOpenDeleteConfirm={handleOpenDeleteConfirm}
          onOpenEditDialog={handleOpenEditDialog}
          hasChanges={hasChanges}
          handleOpenConfirmSave={handleOpenConfirmSave}
        />
        <DataGrid
          rows={rows.map(row => ({
            ...row,
            date: row.date instanceof Date ? row.date : dayjs(row.date, 'DD/MM/YYYY').toDate()
          }))}
          pageSizeOptions={[5,10]}
          pagination
          initialState={{pagination : {paginationModel}}}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) => {
            const newSelectedRows = new Set([...newSelectionModel.ids]);
            setSelectionModel([...newSelectedRows]);
          }}
          selectionModel={selectionModel}
          slots={{
            toolbar: Toolbar,
          }}
          slotProps={{
            toolbar: {
              children: <QuickFilter />,
            },
          }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>Bạn có chắc chắn muốn xóa các ca thi đã chọn không?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirm}>Hủy</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Cập nhật ca thi</DialogTitle>
          <DialogContent>
            {editingRowData && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                  label="Ca"
                  value={editingRowData.shift}
                  onChange={(e) => handleEditDialogChange('ca', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Buổi"
                  value={editingRowData.shift}
                  onChange={(e) => handleEditDialogChange('shift', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Thời gian"
                  value={editingRowData.time}
                  onChange={(e) => handleEditDialogChange('time', e.target.value)}
                  fullWidth
                />
                
                <DatePicker
                  label="Ngày"
                  value={
                    editingRowData?.date
                      ? (typeof editingRowData.date === 'string'
                          ? dayjs(editingRowData.date, 'DD/MM/YYYY')
                          : dayjs(editingRowData.date))
                      : null
                  }
                  onChange={(newValue) =>
                    handleEditDialogChange('date', newValue)
                  }
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />

                <TextField
                  label="Địa điểm"
                  value={editingRowData.location}
                  onChange={(e) => handleEditDialogChange('location', e.target.value)}
                  fullWidth
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Hủy</Button>
            <Button onClick={handleSaveEditDialog} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Thêm ca thi mới</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Ca"
                value={newRowData.ca}
                onChange={(e) => handleAddDialogChange('ca', e.target.value)}
                fullWidth
                error={!!addDialogErrors.ca}
                helperText={addDialogErrors.ca}
              />
              <FormControl fullWidth error={!!addDialogErrors.shift}>
                <InputLabel>Buổi</InputLabel>
                <Select
                  label="Buổi"
                  value={newRowData.shift}
                  onChange={(e) => handleAddDialogChange('shift', e.target.value)}
                >
                  <MenuItem value="Sáng">Sáng</MenuItem>
                  <MenuItem value="Chiều">Chiều</MenuItem>
                </Select>
                {addDialogErrors.shift && <Typography variant="caption" color="error">{addDialogErrors.shift}</Typography>}
              </FormControl>
              <TextField
                label="Thời gian"
                value={newRowData.time}
                onChange={(e) => handleAddDialogChange('time', e.target.value)}
                fullWidth
                error={!!addDialogErrors.time}
                helperText={addDialogErrors.time}
              />
              <DatePicker
                label="Ngày"
                value={newRowData.date}
                onChange={(newValue) => handleAddDialogChange('date', newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!addDialogErrors.date,
                    helperText: addDialogErrors.date,
                  },
                }}
              />
              <TextField
                label="Địa điểm"
                value={newRowData.location}
                onChange={(e) => handleAddDialogChange('location', e.target.value)}
                fullWidth
                error={!!addDialogErrors.location}
                helperText={addDialogErrors.location}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Hủy</Button>
            <Button onClick={handleSaveAddDialog} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
        {/*SaveDialog*/}
        <Dialog open={openConfirmSaveDialog} onClose={handleCloseConfirmSave}>
        <DialogTitle>Xác nhận lưu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn lưu các thay đổi không? Hành động này sẽ cập nhật dữ liệu hiện tại.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmSave} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirmSave} color="primary" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </LocalizationProvider>
  );
}