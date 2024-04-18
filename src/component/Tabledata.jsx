import { useState, useEffect } from "react";
import axios from "axios";

import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/system";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const BASE_API = "https://6620d06e3bf790e070b0c7b5.mockapi.io/api/user";

const Tabledata = () => {
  const [jsondata, setData] = useState([]);

  const [isEdit, setEdit] = useState(false);
  const [isLoding, setLoding] = useState(true);

  const [firstError, setFirstError] = useState("");
  const [lastError, setLastError] = useState("");
  const [genError, setGenError] = useState("");
  const [scoreError, setScoreError] = useState("");
  const [form_data, setForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    score: "",
  });
  const gender_pop = { M: "Male", F: "Female", U: "Unknown" };
  const gender = [
    {
      value: "M",
      label: "Male",
    },
    {
      value: "F",
      label: "Female",
    },
    {
      value: "U",
      label: "Unknown",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoding(true);
    await axios
      .get(`${BASE_API}`)
      .then((res) => setData(res.data) ,setLoding(false))
      .catch((err) => console.log(err));
       
  };

  const edit_data = async (id) => {
    await axios
      .get(`${BASE_API}/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.log(err));
    setEdit(true);
    
  };

  const handelChange = (e) => {
    var value = e.target.value;
    if (e.target.name == "score") {
      value = parseFloat(e.target.value);
    }
    setForm({
      //... ก็อบค่าเดิม
      ...form_data,
      [e.target.name]: value,
    });

  };

  function check_form() {
    if (form_data.firstname === "") {
      setFirstError("First name is required.");
    } else {
      setFirstError("");
    }

    if (form_data.lastname === "") {
      setLastError("Last name is required.");
    } else {
      setLastError("");
    }

    if (form_data.gender === "") {
      setGenError("Gender is required.");
    } else {
      setGenError("");
    }

    if (form_data.score > 100) {
      setScoreError("Maximum is 100");
    } else if (form_data.score < 0 || form_data.score === "") {
      setScoreError("Maximum is 0");
    } else {
      setScoreError("");
    }
  }

  const handleSubmit = async (e) => {
    check_form()
    e.preventDefault();
    if (form_data.firstname === "" || form_data.lastname === "" || form_data.gender === "" || scoreError !=="") {
      return false;
    } else {
      setLoding(true);
      await axios
        .post(`${BASE_API}`, form_data)
        .then(() => {
          loadData();
        })
        .catch((err) => console.log(err));
    }
  };

  const click_edit_data = async () => {
    check_form()
    if (form_data.firstname === "" || form_data.lastname === "" || form_data.gender === "" || scoreError !=="") {
        return false;
      } else {
        var id = form_data.id;
        setLoding(true);
        await axios
          .put(`${BASE_API}/${id}`, form_data)
          .then(() => {
            loadData();
          })
          .catch((err) => console.log(err));
      }
  };

  const clear_data = async () => {
    setForm({
      firstname: "",
      lastname: "",
      gender: "",
      score: "",
    });
    setEdit(false);
    console.log("james");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="firstname" required>
              First name
            </FormLabel>
            <TextField
              id="firstname"
              name="firstname"
              type="name"
              onChange={(e) => handelChange(e)}
              value={form_data.firstname}
              error={firstError !== "" ? true : false}
              helperText={firstError}
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="lastname" required>
              Last name
            </FormLabel>
            <TextField
              id="lastname"
              name="lastname"
              type="lastname"
              onChange={(e) => handelChange(e)}
              value={form_data.lastname}
              error={lastError !== "" ? true : false}
              helperText={lastError}
            />
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="lastname" required>
              Gender
            </FormLabel>
            <TextField
              id="outlined-select-currency"
              select
              defaultValue=""
              name="gender"
              onChange={(e) => handelChange(e)}
              value={form_data.gender}
              error={genError !== "" ? true : false}
              helperText={genError}
            >
              {gender.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormGrid>

          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="lastname" required>
              Score
            </FormLabel>
            <TextField
              id="score"
              type="number"
              name="score"
              onChange={(e) => handelChange(e)}
              value={form_data.score}
              error={scoreError !== "" ? true : false}
              helperText={scoreError}
            />
          </FormGrid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", m: 1 }}>
          <Stack spacing={2} direction="row" textAlign="center">
            {isEdit && (
              <Button variant="contained" onClick={() => click_edit_data()}>
                Edit
              </Button>
            )}
            {!isEdit && (
              <Button variant="contained"  type="submit">
                Add
              </Button>
            )}

            <Button variant="outlined" onClick={() => clear_data()}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
      {isLoding && <div>Loading...</div>}
      {!isLoding && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: '2rem' }}>No</TableCell>
                <TableCell style={{ width: '2rem' }}></TableCell>
                <TableCell>First name</TableCell>
                <TableCell>Last name</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jsondata
                ? jsondata.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">
                        <EditIcon className="pointer" onClick={() => edit_data(row.id)} />
                      </TableCell>
                      <TableCell>{row.firstname}</TableCell>
                      <TableCell>{row.lastname}</TableCell>
                      <TableCell align="center" >
                     
                        <Tooltip className="grabbing"
                          title={gender_pop[row.gender]}
                          placement="right"
                          arrow
                        ><span>
                          {row.gender}
                          </span>
                        </Tooltip>
                       
                      </TableCell>

                      <TableCell align="center">
                        {row.score.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Tabledata;
