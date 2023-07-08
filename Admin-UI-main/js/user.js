//1. khởi tạo danh sách user rỗng
let userList = localStorage.getItem("userList")
  ? JSON.parse(localStorage.getItem("userList"))
  : [];

const username = document.getElementById("username");
const password = document.getElementById("password");
const fullname = document.getElementById("fullname");
const address = document.getElementById("address");
const dateOfBirth = document.getElementById("dateOfBirth");
const radioStatus = document.getElementsByName("radioStatus");
const btnSubmit = document.getElementById("btnSubmit");
const inputSearch = document.getElementById("inputSearch");
const btnSearch = document.getElementById("btnSearch");

// set trang hiện tại :
// xác định số bản ghi trên 1 trang
const recordPerPage = 5;

//2. Hàm renderData lên table và danh sách các trang

function compareUserId(user1, user2) {
  const userId1 = parseInt(user1.userId.slice(1)); // Lấy số từ trường userId và chuyển sang kiểu số nguyên
  const userId2 = parseInt(user2.userId.slice(1));
  return userId2 - userId1; // So sánh theo thứ tự tăng dần
}

const tbody = document.getElementById("tbody");
function renderData(userLocalStorage, currentPage = 1) {
  userLocalStorage.sort(compareUserId);
  //Xử lý pagelocalStorage.getItem("userLocalStorage")
  let totalPages = Math.ceil(userLocalStorage.length / recordPerPage);
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  //Render dữ liệu lên table
  tbody.innerHTML = "";
  const paging = document.getElementById("paging");

  if (totalPages > 1) {
    let pagingHtml = `<ul class="pagination float-end mx-4">`;
    if (currentPage > 1) {
      pagingHtml += `<li class="page-item"><a href="#" class="page-link prev">Prev</a></li>`;
    }
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        pagingHtml += `<li class="page-item"><a href="#" class="page-link page active">${i}</a></li>`;
      } else {
        pagingHtml += `<li class="page-item"><a href="#" class="page-link page">${i}</a></li>`;
      }
    }
    if (currentPage < totalPages) {
      pagingHtml += `<li class="page-item"><a href="#" class="page-link next">Next</a></li>`;
    }
    pagingHtml += `</ul>`;
    paging.innerHTML = pagingHtml;
  } else {
    paging.innerHTML = "";
  }
  let rows = "";
  for (
    let i = (currentPage - 1) * recordPerPage;
    i < currentPage * recordPerPage && i < userLocalStorage.length;
    i++
  ) {
    rows += `<tr>
                  <td>${
                    userLocalStorage[i].userId ? userLocalStorage[i].userId : ""
                  }</td>
                  <td>${
                    userLocalStorage[i].username
                      ? userLocalStorage[i].username
                      : ""
                  }</td>
                  <td>${
                    userLocalStorage[i].fullname
                      ? userLocalStorage[i].fullname
                      : ""
                  }</td>
                  <td>${
                    userLocalStorage[i].address
                      ? userLocalStorage[i].address
                      : ""
                  }</td>
                  <td>${
                    userLocalStorage[i].dateOfBirth
                      ? userLocalStorage[i].dateOfBirth
                      : ""
                  }</td>
                  <td>${
                    userLocalStorage[i].radioStatus
                      ? userLocalStorage[i].radioStatus
                      : ""
                  }</td>
                  <td>${
                    userLocalStorage[i].createDate
                      ? userLocalStorage[i].createDate
                      : ""
                  }</td>
                  `;
    if (userLocalStorage[i].username != "admin") {
      rows += ` <td>
                  <button class="btn btn-info" onclick="onEdit('${userLocalStorage[i].userId}')">Edit</button>
                  <button class="btn btn-danger" onclick="onDelete('${userLocalStorage[i].userId}')">Delete</button>
                </td>`;
    }
    rows += ` </tr>`;
  }
  tbody.innerHTML = rows;

  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const pageButtons = document.querySelectorAll(".page");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderData(userLocalStorage, currentPage);
        updatePageButtons();
      }});
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderData(userLocalStorage, currentPage);
        updatePageButtons();
      }
    });
  }

  function updatePageButtons() {
    pageButtons.forEach((button, index) => {
      button = button.parentNode;
      if (index + 1 === currentPage) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  pageButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      currentPage = index + 1;
      renderData(userLocalStorage, currentPage);
      updatePageButtons();
    });
  });
}

renderData(userList, 1);

let created = true;
function validateInput(index = "") {
  if (username.value == "") {
    alert("Bạn chưa nhập username");
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(username.value)) {
    alert(
      "Username phải là chữ và số và không chứa bất kỳ ký tự đặc biệt nào."
    );
    return;
  }
  if (checkDublicate(username.value, index)) {
    alert("Username không được trùng");
    return;
  }
  if (password.value === "") {
    alert("Vui lòng nhập mật khẩu.");
    return;
  }
  if (fullname.value === "") {
    alert("Vui lòng nhập họ tên.");
    return;
  }
  if (address.value === "") {
    alert("Địa chỉ là bắt buộc.");
    return;
  }
  if (dateOfBirth.value == "") {
    alert("Ngày sinh là bắt buộc");
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.value)) {
    alert("Ngày sinh phải ở định dạng yyyy-mm-dd (ví dụ: 1990-01-01).");
    return;
  }
  return true;
}

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên phải cộng thêm; 1
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  if (userList.length) {
    userId = parseInt(userList[userList.length - 1].userId.slice(1)) + 1;
  } else {
    userId = 1;
  }
  // Lặp qua từng phần tử radio button để kiểm tra xem phần tử nào được chọn
  let status = "";
  for (let i = 0; i < radioStatus.length; i++) {
    if (radioStatus[i].checked) {
      status = radioStatus[i].value;
    }
  }
  //Tự sinh userID:
  let item = {
    userId: "U" + userId.toString().padStart(3, "0"),
    username: username.value,
    address: address.value,
    dateOfBirth: dateOfBirth.value,
    fullname: fullname.value,
    radioStatus: status,
    createDate: dateString,
  };
  let UserID = document.getElementById("userId").value;
  let index = getRowIndex(UserID);
  if (validateInput(index)) {
    if (!UserID) {
      userList.push(item);
    } else {
      userList[index] = item;
    }
    localStorage.setItem("userList", JSON.stringify(userList));
    renderData(userList, 1);
    resetForm();
    contentForm.style.display = "none";
    contentTable.style.display = "block";
  }
});

function onEdit(id) {
  contentForm.style.display = "block";
  contentTable.style.display = "none";
  document.getElementById('titleAction').innerText = "Sửa tài khoản"
  let userLocalStorage = JSON.parse(localStorage.getItem("userList"));
  let index = getRowIndex(id);
  document.getElementById("userId").value = userLocalStorage[index].userId;
  username.value = userLocalStorage[index].username;
  password.value = userLocalStorage[index].password;
  fullname.value = userLocalStorage[index].fullname;
  address.value = userLocalStorage[index].address;
  dateOfBirth.value = userLocalStorage[index].dateOfBirth;

  if (userLocalStorage[index].radioStatus == "Active") {
    document.querySelector("input[value='Active']").checked = true;
  } else {
    document.querySelector("input[value='Inactive']").checked = true;
  }
}

function resetForm() {
  document.getElementById("userId").value = "";
  username.value = "";
  password.value = "";
  fullname.value = "";
  address.value = "";
  dateOfBirth.value = "";
  document.getElementById('titleAction').innerText = "Thêm mới tài khoản"
}

function checkDublicate(userName, key) {
  let userLocalStorage = JSON.parse(localStorage.getItem("userList"));
  if (userLocalStorage && userLocalStorage.length > 0) {
    for (let index = 0; index < userLocalStorage.length; index++) {
      if (
        (key == -1 && userLocalStorage[index].username == userName) ||
        (key != index && userLocalStorage[index].username == userName)
      ) {
        return true;
      }
    }
  }
  return false;
}
//hàm getRowIndex(id) để lấy chỉ số của hàng chứa userID tương ứng
function getRowIndex(id) {
  let userLocalStorage = JSON.parse(localStorage.getItem("userList"));
  if (userLocalStorage && userLocalStorage.length > 0) {
    for (let index = 0; index < userLocalStorage.length; index++) {
      if (userLocalStorage[index].userId == id) {
        return index;
      }
    }
  }
  return -1;
}

function searchData(userList, searchTerm) {
  const searchTermLower = searchTerm.toLowerCase();
  // Lọc danh sách người dùng phù hợp với tiêu chí tìm kiếm
  const filteredUsers = userList.filter(
    (item) =>
      item.username.toLowerCase().includes(searchTermLower) ||
      item.fullname.toLowerCase().includes(searchTermLower)
  );

  // Trả về danh sách người dùng phù hợp
  return filteredUsers;
}

function onDelete(userId) {
  const confirmed = confirm("Bạn có muốn xóa không?");
  if (confirmed) {
    const newData = userList.filter((item) => item.userId !== userId);
    localStorage.setItem("userList", JSON.stringify(newData));
    renderData(newData, 1);
  }
}

document.getElementById("btnCancel").addEventListener("click", function (e) {
  e.preventDefault();
  contentForm.style.display = "none";
  contentTable.style.display = "block";
});

btnSearch.addEventListener("click", function (e) {
  e.preventDefault();
  let filterList = searchData(userList, inputSearch.value);
  renderData(filterList);
});
