import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridRowModes,
  QuickFilter,
} from '@mui/x-data-grid';
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
     <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'primary.main',
          mb: 2, // margin bottom
        }}
      >
        Dữ liệu quản lý ca thi
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

export default function DatTable({ rows, setRows, area }) {
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
    if (!data.slot || data.slot.trim() === "") errors.ca = "Vui lòng nhập số lượng slot";
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
    slot : '',
    area: area,
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
    setRows(rows.map((row) => { 
      return row.id === newRow.id ? updatedRow : row
    }));
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
      area : area
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewRowData({
      shift: '',  
      date: dayjs('DD/MM/YYYY'),
      location: '',
      area:area,
      slot:'',
    });
    setAddDialogErrors({})
  };

  const handleAddDialogChange = (field, value) => {
    setNewRowData({ ...newRowData, [field]: value });
  };

  const handleSaveAddDialog = () => {
    const errors = validateNewRowData(newRowData);
    setAddDialogErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Có lỗi, không thêm
      return;
    }
    const id = rows.length + 1;
    const rowToAdd = {
      id,
      ...newRowData,
      isNew: false,
      date: newRowData.date instanceof Date ? newRowData.date : new Date(newRowData.date),
      area: newRowData.area?? area
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
    console.log(editingRowData)
    if (editingRowData) {
      setEditingRowData({ ...editingRowData, [field]: value });
    }
  };

  const handleSaveEditDialog = () => {
    // if (editingRowData) {
    //   processRowUpdate(editingRowData);
    //   handleCloseEditDialog();
    // }
    if (editingRowData) {
      const updatedId = `${editingRowData.shift}-${editingRowData.date}-${editingRowData.location}`;
      const updatedRow = {
        ...editingRowData,
        id: updatedId,
        date: dayjs(editingRowData.date).toDate(),
      };

      setRows((oldRows) => {
        const idx = oldRows.findIndex((row) => row.id === editingRowData.id);
        console.log(idx)
        if (idx !== -1) {
          console.log('here')
          const updated = [...oldRows];
          updated[idx] = updatedRow;
          return updated;
        }
        return oldRows;
      });
      handleCloseEditDialog();
    }
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 150, editable: false },
    { field: 'shift', headerName: 'Buổi', width: 150, editable: false },
    {
      field: 'date',
      headerName: 'Thời gian',
      type: 'date',
      width: 150,
      editable: false
    },
    { field: 'location', headerName: 'Địa điểm', width: 400, editable: false },
    { field: 'slot', headerName: 'Số lượng Slot', width: 200, editable: false },
    { field: 'area', headerName: 'Thành phố', width: 300, editable: false },

  ];
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
            date: row.date instanceof Date ? row.date : dayjs(row.date, 'DD/MM/YYYY').toDate(),
            area: row.area ?? area,
          }))}
          sx={{height: 400}}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          checkboxSelection
          hideFooter={true}
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
                  label="Buổi"
                  value={editingRowData.shift}
                  onChange={(e) => handleEditDialogChange('shift', e.target.value)}
                  fullWidth
                />
                <DatePicker
                  label="Thời gian"
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
                
                <TextField
                  label="Số lượng slot"
                  value={editingRowData.slot}
                  onChange={(e) => handleEditDialogChange('slot', e.target.value)}
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
              
              <TextField
                label="Slot"
                value={newRowData.slot}
                onChange={(e) => handleAddDialogChange('slot', e.target.value)}
                fullWidth
                error={!!addDialogErrors.slot}
                helperText={addDialogErrors.slot}
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