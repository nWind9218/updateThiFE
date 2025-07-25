import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridRowModes,
  QuickFilter,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
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
function TableActions(props) {
  const {
    rows,
    setRows,
    rowModesModel,
    setRowModesModel,
    selectionModel,
    onAddClick,
    onOpenDeleteConfirm,
  } = props;

  const handleDeleteClick = () => {
    onOpenDeleteConfirm();
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
        <Button startIcon={<AddIcon />} onClick={onAddClick} sx={{ mr: 1 }}>
          Thêm ca thi
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
          color="error"
          disabled={selectionModel.length === 0}
        >
          Xóa
        </Button>
      </Box>
    </Toolbar>
  );
}

export default function DatTable({ rows, setRows, area, reload, setReload }) {
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const [needBackend, setNeedBackend] = React.useState(false)
  const [addDialogErrors, setAddDialogErrors] = React.useState({});
  React.useEffect(() => {
      if (!needBackend) return;
      const fetchData = async () => {
        let data = null
        try {
          if (area == "Hà Nội"){
            const response = await axios.get("https://server-tinz.aipencil.name.vn/hanoi")
            data = response.data
          
          }
          else if (area == "Đà Nẵng"){
            const response = await axios.get("https://server-tinz.aipencil.name.vn/danang")
            data = response.data
          }
          else if (area == "TP. Hồ Chí Minh"){
            const response = await axios.get("https://server-tinz.aipencil.name.vn/tphcm")
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
          // setOriginalRows(processedData) - Removed as not needed
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
  // HANDLE VALIDATE INFOMATION
  const validateNewRowData = (data) => {
    const errors = {};
    if (!data.slot || data.slot.trim() === "") errors.slot = "Vui lòng nhập số lượng slot";
    if (!data.date) {
      errors.date = "Vui lòng chọn ngày";
    } else {
      // Kiểm tra ngày không được chọn quá khứ
      const selectedDate = dayjs(data.date);
      const today = dayjs().startOf('day');
      if (selectedDate.isBefore(today)) {
        errors.date = "Ngày thi không được chọn trong quá khứ";
      }
    }
    if (!data.location || data.location.trim() === "") errors.location = "Vui lòng nhập địa điểm";
    if (!data.ca || data.ca === "") errors.ca = "Vui lòng chọn ca thi";
    if (!data.time || data.time.trim() === "") errors.time = "Vui lòng nhập thời gian thi";
    return errors;
  };
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
  const handleSaveAddDialog = async () => {
    const errors = validateNewRowData(newRowData);
    setAddDialogErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.error(errors)
      return;
    }

    try {
      // Chuẩn bị dữ liệu để gửi lên server
      const dataToSend = {
        ca_thi: newRowData.ca,
        buoi: newRowData.shift.includes('Sáng') ? 'buổi sáng' : 'buổi chiều',
        ngay_thi: dayjs(newRowData.date).format('DD/MM/YYYY'),
        gio_thi: newRowData.time,
        dia_diem: newRowData.location,
        slot: newRowData.slot.toString(),
        area: area
      };

      // Gọi API thêm ca thi
      const response = await axios.post("https://server-tinz.aipencil.name.vn/addExamSession", dataToSend);
      
      if (response.status === 201) {
        console.log("Thêm ca thi thành công:", response.data);
        
        // Cập nhật giao diện
        const id = rows.length + 1;
        const rowToAdd = {
          ...newRowData,
          id,
          date: dayjs(newRowData.date).format('DD/MM/YYYY'),
          area: area
        };
        const newRows = [rowToAdd, ...rows];
        setRows(newRows);
        handleCloseAddDialog();
        setAddDialogErrors({});
        
        // Reload dữ liệu để đồng bộ
        setReload(!reload);
      }
    } catch (error) {
      console.error("Lỗi khi thêm ca thi:", error);
      setAddDialogErrors({ general: "Có lỗi xảy ra khi thêm ca thi. Vui lòng thử lại." });
    }
  };


  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      // Lấy danh sách các ca thi được chọn để xóa
      const selectedRows = rows.filter((row) => selectionModel.includes(row.id));
      
      // Chuẩn bị dữ liệu để gửi lên server
      const examSessionsToDelete = selectedRows.map((row) => ({
        ca_thi: row.ca,
        buoi: row.shift.includes('Sáng') ? 'buổi sáng' : 'buổi chiều',
        ngay_thi: row.date,
        dia_diem: row.location
      }));

      // Gọi API xóa ca thi
      const response = await axios.delete("https://server-tinz.aipencil.name.vn/deleteExamSession", {
        data: {
          examSessions: examSessionsToDelete,
          area: area
        }
      });

      if (response.status === 200) {
        console.log("Xóa ca thi thành công:", response.data);
        
        // Cập nhật giao diện
        const filteredRows = rows.filter((row) => !selectionModel.includes(row.id));
        const newRows = filteredRows.map((row, idx) => ({
          ...row,
          id: idx + 1,
        }));
        setRows(newRows);
        
        setTimeout(() => {
          setSelectionModel([]);
        }, 0);
        
        // Reload dữ liệu để đồng bộ
        setReload(!reload);
      }
    } catch (error) {
      console.error("Lỗi khi xóa ca thi:", error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    }
    
    handleCloseDeleteConfirm();
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
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                    fullWidth: true,
                    error: !!addDialogErrors.date,
                    helperText: addDialogErrors.date,
                    },
                  }}
                />
                <TextField
                  label="Thời gian"
                  value={newRowData.time}
                  onChange={(e) => handleAddDialogChange('time', e.target.value)}
                  fullWidth
                  error={!!addDialogErrors.time}
                  helperText={addDialogErrors.time}
                  placeholder="Ví dụ: 08:00 - 09:30"
                />
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
      </Box>
    </LocalizationProvider>
  );
}
