let userInfor = JSON.parse(sessionStorage.getItem("userInfor"));
if (!userInfor) {
    location.href = "/Admin-UI-main/login.html";
}
document.getElementById('inforLogin').innerText = userInfor.username
//Khi log out:
function logout() {
    sessionStorage.removeItem("userInfor");
    location.href = "/Admin-UI-main/login.html";
}
// event click button addNew
const addNew = document.getElementById("addNew");
const contentForm = document.getElementById("contentForm");
const contentTable = document.getElementById("contentTable");
addNew.addEventListener("click", function () {
    contentForm.style.display = "block";
    contentTable.style.display = "none";
});
