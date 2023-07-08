//1. khởi tạo danh sách product rỗng
let productList = localStorage.getItem("productList")
    ? JSON.parse(localStorage.getItem("productList"))
    : [];

let categories = localStorage.getItem("categoryList")
    ? JSON.parse(localStorage.getItem("categoryList"))
    : [];
const productname = document.getElementById("productname");
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

// Tạo một thẻ option mới
for (let i = 0; i <= categories.length; i++) {
    let option = document.createElement("option");
    if (categories[i]) {
        option.value = categories[i].categoryId;
        option.text = categories[i].categoryname;
        category.appendChild(option);
    }
}

function compareproductId(product1, product2) {
    const productId1 = parseInt(product1.productId.slice(1)); // Lấy số từ trường productId và chuyển sang kiểu số nguyên
    const productId2 = parseInt(product2.productId.slice(1));
    return productId2 - productId1; // So sánh theo thứ tự tăng dần
}

const tbody = document.getElementById("tbody");

function renderData(productLocalStorage, currentPage = 1) {

  if (productLocalStorage.length == 0) {
    return false
  }
    productLocalStorage.sort(compareproductId);
    //Xử lý pagelocalStorage.getItem("productLocalStorage")
    let totalPages = Math.ceil(productLocalStorage.length / recordPerPage);
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
    for (let i = (currentPage - 1) * recordPerPage;i < currentPage * recordPerPage && i < productLocalStorage.length;i++) {
        rows += `<tr>
        <td>${productLocalStorage[i] ? productLocalStorage[i].productId : ""}</td>
        <td>${productLocalStorage[i]? productLocalStorage[i].productname: ""}</td>
        <td></td>
        <td>${productLocalStorage[i]? productLocalStorage[i].category: ""}</td>  
        <td>${productLocalStorage[i]? productLocalStorage[i].price: ""
        }</td><td>${productLocalStorage[i]? productLocalStorage[i].status: ""}</td>
        <td>${productLocalStorage[i]? productLocalStorage[i].description: ""}</td>
        <td>${productLocalStorage[i]? productLocalStorage[i].createDate: ""}</td>
        <td>
         <button class="btn btn-info" onclick="onEdit('${productLocalStorage[i]? productLocalStorage[i].productId: ""}')">Edit</button>
         <button class="btn btn-danger" onclick="onDelete('${productLocalStorage[i]? productLocalStorage[i].productId: ""}')">Delete</button>
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
            renderData(productLocalStorage, currentPage);
            updatePageButtons();
        }});
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
            currentPage++;
            renderData(productLocalStorage, currentPage);
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
            renderData(productLocalStorage, currentPage);
            updatePageButtons();
        });
    });
}

renderData(productList, 1);

function validateInput(index = "") {
    if (productname.value == "") {
        alert("Vui lòng nhập tên sản phẩm");
        return false;
    }
    if (checkDublicate(productname.value, index)) {
        alert("Tên sản phẩm không được trùng");
        return;
    }


    if (category.value == "") {
        alert("Vui lòng nhập loại sản phẩm");
        return false;
    }


    if (price.value == "") {
        alert("Vui lòng nhập giá sản phẩm");
        return false;
    }

    if (isNaN(price.value)) {
        alert("Giá sản phẩm phải là số");
        return false;
    }

    if (description.value.length > 300) {
        alert("Mô tả sản phẩm không được vượt quá 300 ký tự");
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

    if (productList.length) {
        productId = parseInt(productList[productList.length - 1].productId.slice(1)) + 1;
    } else {
        productId = 1;
    }
    // Lặp qua từng phần tử radio button để kiểm tra xem phần tử nào được chọn
    let status = "";
    for (let i = 0; i < radioStatus.length; i++) {
        if (radioStatus[i].checked) {
            status = radioStatus[i].value;
        }
    }
    //Tự sinh productID:
    let item = {
        productId: "P" + productId.toString().padStart(3, "0"),
        productname: productname.value,
        description: description.value,
        createDate: dateString,
        price: price.value,
        category: category.value,
        status: status,
    };
    let productID = document.getElementById("productId").value;
    let index = getRowIndex(productID);
    if (validateInput(index)) {
        if (!productID) {
            productList.push(item);
        } else {
            productList[index] = item;
        }
        localStorage.setItem("productList", JSON.stringify(productList));
        renderData(productList, 1);
        resetForm();
        contentForm.style.display = "none";
        contentTable.style.display = "block";
    }
});

function onEdit(id) {
    contentForm.style.display = "block";
    contentTable.style.display = "none";
    document.getElementById('titleAction').innerText = "Sửa sản phẩm";
    let productLocalStorage = JSON.parse(localStorage.getItem("productList"));
    let index = getRowIndex(id);
    document.getElementById("productId").value = productLocalStorage[index].productId;
    productname.value = productLocalStorage[index].productname;
    category.value = productLocalStorage[index].category;
    description.value = productLocalStorage[index].description;
    price.value = productLocalStorage[index].price;
    if (productLocalStorage[index].status == "Active") {
        document.querySelector("input[value='Active']").checked = true;
    } else {
        document.querySelector("input[value='Inactive']").checked = true;
    }
}

function resetForm() {
    document.getElementById("productId").value = "";
    productname.value = "";
    category.value = "";
    document.getElementById("active").checked = true;
    description.value = "";
    price.value = "";
    document.getElementById('titleAction').innerText = "Thêm mới sản phẩm";
}

function checkDublicate(productName, key) {
    let productLocalStorage = JSON.parse(localStorage.getItem("productList"));
    if (productLocalStorage && productLocalStorage.length > 0) {
        for (let index = 0; index < productLocalStorage.length; index++) {
            if (
                (key == -1 && productLocalStorage[index].productname == productName) ||
                (key != index && productLocalStorage[index].productname == productName)
            ) {
                return true;
            }
        }
    }
    return false;
}

//hàm getRowIndex(id) để lấy chỉ số của hàng chứa productID tương ứng
function getRowIndex(id) {
    let productLocalStorage = JSON.parse(localStorage.getItem("productList"));
    if (productLocalStorage && productLocalStorage.length > 0) {
        for (let index = 0; index < productLocalStorage.length; index++) {
            if (productLocalStorage[index].productId == id) {
                return index;
            }
        }
    }
    return -1;
}

function searchData(productList, searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    // Lọc danh sách người dùng phù hợp với tiêu chí tìm kiếm
    const filteredproducts = productList.filter(
        (item) =>
        item.productname.toLowerCase().includes(searchTermLower) ||
        item.category.toLowerCase().includes(searchTermLower)
);

    // Trả về danh sách người dùng phù hợp
    return filteredproducts;
}

function onDelete(productId) {
    const confirmed = confirm("Bạn có muốn xóa không?");
    if (confirmed) {
        const newData = productList.filter((item) => item.productId !== productId);
        localStorage.setItem("productList", JSON.stringify(newData));
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
    let filterList = searchData(productList, inputSearch.value);
    renderData(filterList);
});
