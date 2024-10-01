const api = "http://localhost:4100/api/signup";
const studentApi = "http://localhost:4100/api/studnets"

export const apiConfig = {
    RegisterApi: `${api}/register`,
    LoginApi: `${api}/login`,
    SignupGetData: `${api}/getdata`,
    UpdatePermission: `${api}/update-permissions`,

    AddStudent: `${studentApi}/addstudent`,
    GetStudent: `${studentApi}/getstudent`,
    UpdateStudent: `${studentApi}/updatestudent`,
    DeleteStudent: `${studentApi}/deletestudent`,
  };