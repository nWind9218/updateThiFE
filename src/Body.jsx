import React, { useEffect, useState } from "react";
  import DropAddress from "./utils/DropAddress";
  import DropShift from "./utils/DropShift";
  import DropDate from "./utils/DropDate";
  import Box from "@mui/material/Box";
  import Grid from "@mui/material/Grid";
  import Typography from "@mui/material/Typography";
  import Paper from "@mui/material/Paper";
  import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
  import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
  import AccessTimeIcon from "@mui/icons-material/AccessTime";
  import Button from "@mui/material/Button";
  import DatTable from "./DatTable";
import axios from "axios";


  // const updateExamShiftData = [
  //   { value: "Ca 1 buổi sáng", time: "07h45 - 09h15"},
  //   { value: "Ca 2 buổi sáng", time: "09h30 - 11h00"},
  //   { value: "Ca 3 buổi sáng", time: "11h00 - 12h30"},
  //   { value: "Ca 1 buổi chiều", time: "14h00 - 15h30"},
  //   { value: "Ca 2 buổi chiều", time: "15h30 - 17h00"},
  //   { value: "Ca 3 buổi chiều", time: "17h00 - 18h30"}
  // ];
  // const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);// hello => Hello
  const Body = () => {
    const [address, setAddress] = useState("Hà Nội");
    const [reload, setReload] = useState(false)
    const [, setShift] = useState("");
    const [, setDate] = useState(null);
    const [, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const initialShift = "";
    const initialDate = null;
    const initialAddress = "Hà Nội";
    useEffect(() => {
      const fetchData = async () => {
        let data = null
        try {
          if (address == "Hà Nội"){
            const response = await axios.get("http://localhost:5000/hanoi")
            data = response.data
          }
          else if (address == "Đà Nẵng"){
            const response = await axios.get("http://localhost:5000/danang")
            data = response.data
          }
          else if (address == "TP. Hồ Chí Minh"){
            const response = await axios.get("http://localhost:5000/tphcm")
            data = response.data
          }
          const distinctList = (() => {
            const map = new Map();

            for (const item of data) {
              const key = `${item.buoi}|${item.dia_diem}|${item.slot}|${item.ngay_thi}`;
              if (!map.has(key)) map.set(key, item);
            }

            return Array.from(map.values());
          })();
          const sortedList = Array.from(distinctList.values()).sort((a, b) => {
            const cmpDiaDiem = a.ngay_thi.localeCompare(b.ngay_thi); // DESC
            if (cmpDiaDiem !== 0) return cmpDiaDiem;

            return b.buoi.localeCompare(a.buoi); // DESC
          });
          // console.log(sortedList)
          const processedData = sortedList.map((item) => {
            
          return {
            id : `${item.shift}|${item.date}|${item.location}`,
            slot: item.slot, 
            shift: typeof item?.buoi === 'string'
                ? (item.buoi.includes("sáng") ? "Sáng"
                  : item.buoi.includes("chiều") ? "Chiều"
                  : "Không có dữ liệu")
                : "Không có dữ liệu",
            date: item?.ngay_thi
                ? item.ngay_thi.trim()
                : "Không có dữ liệu",
            location: typeof item?.dia_diem === 'string'
                ? item.dia_diem.replace("Thi tại ", "")
                : "Không có dữ liệu",
            
          };
        });
          console.log(processedData)
          setRows(processedData)
          setFilteredRows(processedData)
        }
        catch(error){
          console.error("Lỗi khi lấy dữ liệu: ", error)
        }
      }
      fetchData()
    }, [address, reload]);
    const handleResetFilter = () => {
        setAddress(initialAddress);
        setShift(initialShift);
        setDate(initialDate);
      };
    const handleFilter = () => {
      // let result = [...rows];
      setReload(!reload)
      // setFilteredRows(result);
    };
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)", // xanh lá cây nhạt
          boxSizing: "border-box",
          pt: { xs: "74px", sm: "50px" },
          pb: { xs: "64px", sm: "64px" },
        }}
      >
        {/* Filter Section */}
        <Paper
          elevation={7}
          sx={{
            borderRadius: 3,
            px: { xs: 2, md: 5 },
            py: { xs: 2, md: 3 },
            width: "100%",
            maxWidth: 1430,
            mx: "auto",
            mt: { xs: 3, md: 5 },
            mb: { xs: 3, md: 5 },
            background: "rgba(232,245,233,0.96)", // xanh lá cây nhạt
            boxShadow: "0 8px 40px 0 rgba(31,38,135,0.12)",
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center", mb: { xs: 1.5, md: 0 } }}>
              <Box
    component="img"
    src="/logo.jpg"
    alt="Logo"
    sx={{
      width: 38,
      height: 38,
      mr: 1,
      borderRadius: "8px",
      objectFit: "cover",
      boxShadow: 2,
      background: "#fff"
    }}
  />
              <Box>
                <Typography variant="h5" fontWeight={700} color="primary">
                  Quản lý ca thi
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Bộ lọc hỗ trợ tìm kiếm, cập nhật ca thi
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={10} alignItems="center" flexWrap="wrap">
                <Grid item xs={12} sm={4} md={3}>
                  <DropAddress address={address} setAddress={setAddress} />
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "flex-end" },
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        fontWeight: 700,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        letterSpacing: 1,
                      }}
                      onClick={handleFilter}
                    >
                      Reload
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      disabled = "true"
                      sx={{
                        fontWeight: 700,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        letterSpacing: 1,
                        ml: 2,
                      }}
                      onClick={handleResetFilter}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Data Table Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
            mx: "auto",
            bgcolor: "transparent",
            borderRadius: 2,
            minHeight: 500,
          }}
        >
          <DatTable rows={filteredRows} setRows={setRows} area={address}/>
        </Box>
      </Box>
    );
  };

  export default Body;
