//1. khởi tạo danh sách category rỗng
let categoryList = localStorage.getItem("categoryList")
    ? JSON.parse(localStorage.getItem("categoryList"))
    : [];

let categories = localStorage.getItem("categoryList")
    ? JSON.parse(localStorage.getItem("categoryList"))
    : [];
const categoryname = document.getElementById("categoryname");
const description = document.getElementById("description");
const price = document.getElementById("price");
const radioStatus = document.getElementsByName("radioStatus");
const category = document.getElementById("category");
const btnSubmit = document.getElementById("btnSubmit");
const inputSearch = document.getElementById("inputSearch");
const btnSearch = document.getElementById("btnSearch");

// set trang hiện tại :
// xác định số bản ghi trên 1 trang
const recordPerPage = 5;

function comparecategoryId(category1, category2) {
    const categoryId1 = parseInt(category1.categoryId.slice(1)); // Lấy số từ trường categoryId và chuyển sang kiểu số nguyên
    const categoryId2 = parseInt(category2.categoryId.slice(1));
    return categoryId2 - categoryId1; // So sánh theo thứ tự tăng dần
}

const tbody = document.getElementById("tbody");

function renderData(categoryLocalStorage, currentPage=1) {
    if (categoryLocalStorage.length == 0) {
        return false
    }
    categoryLocalStorage.sort(comparecategoryId);
    //Xử lý pagelocalStorage.getItem("categoryLocalStorage")
    let totalPages = Math.ceil(categoryLocalStorage.length / recordPerPage);
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
    tbody.innerHTML = ""
    for (let i = (currentPage - 1) * recordPerPage;i < currentPage * recordPerPage && i < categoryLocalStorage.length;i++) {
        rows += `<tr>
        <td>${categoryLocalStorage[i] ? categoryLocalStorage[i].categoryId : ""}</td>
        <td>${categoryLocalStorage[i]? categoryLocalStorage[i].categoryname: ""}</td>
        <td>${categoryLocalStorage[i]? categoryLocalStorage[i].description: ""}</td>
        <td>${categoryLocalStorage[i]? categoryLocalStorage[i].createDate: ""}</td>
        <td>
         <button class="btn btn-info" onclick="onEdit('${categoryLocalStorage[i]? categoryLocalStorage[i].categoryId: ""}')">Edit</button>
         <button class="btn btn-danger" onclick="onDelete('${categoryLocalStorage[i]? categoryLocalStorage[i].categoryId: ""}')">Delete</button>
         </td></tr>`;
    }
    tbody.innerHTML = rows;

    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const pageButtons = document.querySelectorAll(".page");

    if (prevButton) {
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
            currentPage--;
            renderData(categoryLocalStorage, currentPage);
            updatePageButtons();
        }});
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
            currentPage++;
            renderData(categoryLocalStorage, currentPage);
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
            renderData(categoryLocalStorage, currentPage);
            updatePageButtons();
        });
    });
}

renderData(categoryList, 1);

function validateInput(index = "") {
    if (categoryname.value == "") {
        alert("Vui lòng nhập tên loại sản phẩm");
        return false;
    }
    if (checkDublicate(categoryname.value, index)) {
        alert("Tên loại sản phẩm không được trùng");
        return;
    }


    if (description.value.length > 300) {
        alert("Mô tả loại sản phẩm không được vượt quá 300 ký tự");
        return false;
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

    if (categoryList.length) {
        categoryId = parseInt(categoryList[categoryList.length - 1].categoryId.slice(1)) + 1;
    } else {
        categoryId = 1;
    }
    let item = {
        categoryId: "C" + categoryId.toString().padStart(3, "0"),
        categoryname: categoryname.value,
        description: description.value,
        createDate: dateString,
    };
    let categoryID = document.getElementById("categoryId").value;
    let index = getRowIndex(categoryID);
    if (validateInput(index)) {
        if (!categoryID) {
            categoryList.push(item);
        } else {
            categoryList[index] = item;
        }
        localStorage.setItem("categoryList", JSON.stringify(categoryList));
        renderData(categoryList, 1);
        resetForm();
        contentForm.style.display = "none";
        contentTable.style.display = "block";
    }
});

function onEdit(id) {
    contentForm.style.display = "block";
    contentTable.style.display = "none";
    let categoryLocalStorage = JSON.parse(localStorage.getItem("categoryList"));
    let index = getRowIndex(id);
    document.getElementById("categoryId").value = categoryLocalStorage[index].categoryId;
    categoryname.value = categoryLocalStorage[index].categoryname;
    description.value = categoryLocalStorage[index].description;
    document.getElementById('titleAction').innerText = "Sửa loại sản phẩm";
}

function resetForm() {
    document.getElementById("categoryId").value = "";
    categoryname.value = "";
    description.value = "";
    document.getElementById('titleAction').innerText = "Thêm mới loại sản phẩm";
}

function checkDublicate(categoryName, key) {
    let categoryLocalStorage = JSON.parse(localStorage.getItem("categoryList"));
    if (categoryLocalStorage && categoryLocalStorage.length > 0) {
        for (let index = 0; index < categoryLocalStorage.length; index++) {
            if (
                (key == -1 && categoryLocalStorage[index].categoryname == categoryName) ||
                (key != index && categoryLocalStorage[index].categoryname == categoryName)
            ) {
                return true;
            }
        }
    }
    return false;
}

//hàm getRowIndex(id) để lấy chỉ số của hàng chứa categoryID tương ứng
function getRowIndex(id) {
    let categoryLocalStorage = JSON.parse(localStorage.getItem("categoryList"));
    if (categoryLocalStorage && categoryLocalStorage.length > 0) {
        for (let index = 0; index < categoryLocalStorage.length; index++) {
            if (categoryLocalStorage[index].categoryId == id) {
                return index;
            }
        }
    }
    return -1;
}

function searchData(categoryList, searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    // Lọc danh sách người dùng phù hợp với tiêu chí tìm kiếm
    const filteredcategorys = categoryList.filter(
        (item) => item.categoryname.toLowerCase().includes(searchTermLower));

    // Trả về danh sách người dùng phù hợp
    return filteredcategorys;
}

function onDelete(categoryId) {
    const confirmed = confirm("Bạn có muốn xóa không?");
    if (confirmed) {
        const newData = categoryList.filter((item) => item.categoryId !== categoryId);
        localStorage.setItem("categoryList", JSON.stringify(newData));
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
    let filterList = searchData(categoryList, inputSearch.value);
    renderData(filterList);
});
