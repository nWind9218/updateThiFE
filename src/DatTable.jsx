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
import axios from 'axios';
import Menu from '@mui/material/Menu';
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
              // disabled={selectionModel.length!==1}
              disabled={true}
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

export default function DatTable({ rows, setRows, area, reload, setReload }) {
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editingRowData, setEditingRowData] = React.useState(null);
  const [needBackend, setNeedBackend] = React.useState(false)
  const [originalRows, setOriginalRows] = React.useState(rows);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [openConfirmSaveDialog, setOpenConfirmSaveDialog] = React.useState(false);
  const [addDialogErrors, setAddDialogErrors] = React.useState({});
  const handleOpenConfirmSave = () => setOpenConfirmSaveDialog(true);
  const handleCloseConfirmSave = () => setOpenConfirmSaveDialog(false);
  React.useEffect(() => {
      if (!needBackend) return;
      const fetchData = async () => {
        let data = null
        try {
          if (area == "Hà Nội"){
            const response = await axios.get("http://localhost:5000/hanoi")
            data = response.data
          
          }
          else if (area == "Đà Nẵng"){
            const response = await axios.get("http://localhost:5000/danang")
            data = response.data
          }
          else if (area == "TP. Hồ Chí Minh"){
            const response = await axios.get("http://localhost:5000/tphcm")
            data = response.data
          }
          
          // const distinctList = (() => {
          //   const map = new Map();

          //   for (const item of data) {
          //     const key = `${item.buoi}|${item.dia_diem}|${item.slot}|${item.ngay_thi}`;
          //     item.buoi = (typeof item?.buoi === 'string')? (item.buoi.includes("sáng") ? "Sáng"
          //         : item.buoi.includes("chiều") ? "Chiều"
          //         : "Không có dữ liệu")
          //       : "Không có dữ liệu"
          //     item.date = item?.ngay_thi
          //       ? item.ngay_thi.trim()
          //       : "Không có dữ liệu"
          //     if (!map.has(key)) map.set(key, item);
          //   }
          //   return Array.from(map.values());
          // })();
          const processedData = data.map((item) => {
            return {
              slot: item.slot, 
              shift: item.buoi,
              date: item?.ngay_thi
                  ? item.ngay_thi.trim()
                  : "Không có dữ liệu",
              location: typeof item?.dia_diem === 'string'
                  ? item.dia_diem.replace("Thi tại ", "")
                  : "Khác",
              area: area,
              ca: item.ca_thi== null?'': item.ca_thi,
              time: item.gio_thi == null?'': item.gio_thi
            };
          });
          setOriginalRows(processedData)
        }
        catch(error){
          console.error("Lỗi khi lấy dữ liệu: ", error)
        }
        finally{
          setNeedBackend(false)
        }
      }
      fetchData()
    }, [needBackend, area]);
  // Handle Sending Request To Server for Update Information
  const CA_THI = ['Ca 1', 'Ca 2','Ca 3']
  const GIO_THI_SANG = ['07h45 - 09h15','09h30 - 11h00', '11h00 - 12h30']
  const GIO_THI_CHIEU = ['14h00 - 15h30', '15h30 - 17h00','17h00 - 18h30']
  const FullyFormatDataFromTable = (originalRows) =>{
    if (!Array.isArray(originalRows)) return [];
    const result = [];
    if (area == 'Hà Nội' || area == 'TP. Hồ Chí Minh'){
    originalRows.forEach((originalRow) => {
      for (let i = 0; i < 3; i++) {
        result.push({
          ca_thi: CA_THI[i],
          buoi: originalRow.shift.includes('Sáng')? 'buổi sáng': 'buổi chiều',
          ngay_thi:originalRow.date,
          gio_thi: originalRow.shift.includes('Sáng')?GIO_THI_SANG[i]:GIO_THI_CHIEU[i],
          dia_diem:originalRow.location.includes("Khác")?"Khác": originalRow.location,
          slot: originalRow.slot.toString()
        });
      }
    });}
    else {
      originalRows.forEach((originalRow) => {
        result.push({
          ca_thi: originalRow.ca.includes('Không có dữ liệu')?'Không có dữ liệu': originalRow.ca,
          gio_thi: originalRow.time.includes('Không có dữ liệu')?'Không có dữ liệu':originalRow.time,
          buoi: originalRow.shift.includes('Không có dữ liệu')? 'Không có dữ liệu': originalRow.shift,
          ngay_thi:originalRow.date,
          dia_diem:originalRow.location.includes("Khác")?"Khác": originalRow.location,
          slot: originalRow.slot.toString()
        });
      })
    }
    return result;
  }
  const handleConfirmSave = () => {
    // setNeedBackend(true)
    const newRowsUpdate = rows.map((originalRow) => ({
          ca_thi: originalRow.ca.includes('Không có dữ liệu') ? 'Không có dữ liệu' : originalRow.ca,
          gio_thi: originalRow.time.includes('Không có dữ liệu') ? 'Không có dữ liệu' : originalRow.time,
          buoi: originalRow.shift.includes('Sáng') ? 'buổi sáng' : 'buổi chiều',
          ngay_thi: originalRow.date,
          dia_diem: originalRow.location.includes("Khác") ? "Khác" : originalRow.location,
          slot: originalRow.slot.toString()
        }));
    
    console.log(newRowsUpdate)
    const dataSent = 
    {
      data: newRowsUpdate,
      area: area
    }
    axios.post("http://localhost:5000/updateTinZ", dataSent)
      .then((response) => {
        console.log("Dữ liệu đã được cập nhật thành công:", response.data.inserted);
      })
      .catch((error) => {
        console.error("Lỗi khi gửi dữ liệu:", error);
      });
    setOpenConfirmSaveDialog(false);
    setReload(!reload)
  };
  // HANDLE VALIDATE INFOMATION
  const validateNewRowData = (data) => {
    const errors = {};
    if (!data.slot || data.slot.trim() === "") errors.ca = "Vui lòng nhập số lượng slot";
    if (!data.date) errors.date = "Vui lòng chọn ngày";
    if (!data.location || data.location.trim() === "") errors.location = "Vui lòng nhập địa điểm";
    if (!data.ca || data.ca === "") errors.ca = "Vui lòng chọn ca thi"
    if (!data.time || data.time === "") errors.ca = "Vui lòng chọn thời gian thi"
    return errors;
  };
  React.useEffect(() => {
    const isChanged = JSON.stringify(rows) !== JSON.stringify(originalRows);
    setHasChanges(isChanged);
  }, [rows, originalRows]);
  // ADD DIALOG
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [newRowData, setNewRowData] = React.useState({
    shift: '',
    slot : '',
    area: area,
    date: dayjs('DD/MM/YYYY'),
    location: '',
    ca:'',
    time:''
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
      date: dayjs('DD/MM/YYYY'),
      location: '',
      area : area,
      slot: '',
      ca: '',
      time:''
    });
    setOpenAddDialog(true);
  };
  
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewRowData({
      ca: '',
      time: '',
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
      console.error(errors)
      return;
    }
    const id = rows.length + 1;
    const rowToAdd = {
      ...newRowData,
      id,
      // isNew: false,
      date: dayjs(newRowData.date).format('DD/MM/YYYY'),
      area: newRowData.area?? area
    };
    const newRows = [rowToAdd, ...rows]
    setRows(newRows);
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
    // Lọc row không bị xóa
    const filteredRows = rows.filter((row) => !selectionModel.ids.has(row.id));
    // Gán lại id tăng dần từ 1
    const newRows = filteredRows.map((row, idx) => ({
      ...row,
      id: idx + 1,
    }));
    setRows(newRows);
    setTimeout(() => {
      setSelectionModel([]);
    }, 0);
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

  const areRowsEqual = (rows1, rows2) => { // Used for edit
      if (rows1.length !== rows2.length) return false;
      const normalize = (row) => ({
        slot: String(row.slot).trim(),
        shift: String(row.shift).trim(),
        date: dayjs(row.date).format('DD/MM/YYYY'),
        location: String(row.location).trim(),
      });
      const sorted1 = [...rows1].map(normalize).sort((a, b) =>
        (a.shift + a.date + a.location + a.slot).localeCompare(b.shift + b.date + b.location + b.slot)
      );
      const sorted2 = [...rows2].map(normalize).sort((a, b) =>
        (a.shift + a.date + a.location + a.slot).localeCompare(b.shift + b.date + b.location + b.slot)
      );
      for (let i = 0; i < sorted1.length; i++) {
        if (
          sorted1[i].slot !== sorted2[i].slot ||
          sorted1[i].shift !== sorted2[i].shift ||
          sorted1[i].date !== sorted2[i].date ||
          sorted1[i].location !== sorted2[i].location
        ) {
          console.log("Sai");
          return;
        }
      }
      console.log("Đúng");
    };
  const handleEditDialogChange = (field, value) => {
    if (editingRowData) {
      setEditingRowData({ ...editingRowData, [field]: value });
      areRowsEqual(originalRows, rows)
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
        if (idx !== -1) {
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

    { field: 'ca', headerName: 'Ca', width: 150, editable: false },
    { field: 'shift', headerName: 'Buổi', width: 150, editable: false },
    {
      field: 'date',
      headerName: 'Ngày',
      type: 'date',
      width: 150,
      editable: false
    },
    { field: 'time', headerName: 'Thời gian', width: 150, editable: false },
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
          hideFooter={true}
          key={rows.length}
          onRowSelectionModelChange={(newSelectionModel) => {
            // const newSelectedRows = new Set([...newSelectionModel.ids]);`
            // setSelectionModel([...newSelectedRows]);
            setSelectionModel(newSelectionModel)
          }}
          checkboxSelection
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
              <FormControl fullWidth>
                <InputLabel>Ca</InputLabel>
                <Select
                  label="Ca"
                  value={newRowData.ca}
                  onChange={(e) => handleAddDialogChange('ca', e.target.value)}
                >
                  <MenuItem value="Ca 1">Ca 1</MenuItem>
                  <MenuItem value="Ca 2">Ca 2</MenuItem>
                  <MenuItem value="Ca 3">Ca 3</MenuItem>

                </Select>
                {/* {addDialogErrors.ca && <Typography variant="caption" color="error">{addDialogErrors.ca}</Typography>} */}
                
                </FormControl>
                <FormControl fullWidth>
                <InputLabel>Buổi</InputLabel>
                <Select
                  label="Buổi"
                  value={newRowData.shift}
                  onChange={(e) => handleAddDialogChange('shift', e.target.value)}
                >
                  <MenuItem value="Sáng">Sáng</MenuItem>
                  <MenuItem value="Chiều">Chiều</MenuItem>
                </Select>
                {/* {addDialogErrors.shift && <Typography variant="caption" color="error">{addDialogErrors.shift}</Typography>} */}
                
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
                <FormControl fullWidth>
                <InputLabel>Thời gian</InputLabel>
                <Select
                  label="Thời gian"
                  value={newRowData.time}
                  disabled={!!newRowData.shift}
                  onChange={(e) => handleAddDialogChange('time', e.target.value)}
                >
                    {newRowData.shift === "Sáng"
                      ? GIO_THI_SANG.map((gio, idx) => (
                    <MenuItem key={idx} value={gio}>{gio}</MenuItem>
                        ))
                      : GIO_THI_CHIEU.map((gio, idx) => (
                    <MenuItem key={idx} value={gio}>{gio}</MenuItem>
                        ))
                    }
                  </Select>
                {/* {addDialogErrors.time && <Typography variant="caption" color="error">{addDialogErrors.time}</Typography>} */}
                </FormControl>
                <TextField
                  label="Địa điểm"
                  value={newRowData.location}
                  onChange={(e) => handleAddDialogChange('location', e.target.value)}
                  fullWidth
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