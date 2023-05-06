var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/demoproject";
function checkIsNull(value) {
    return value === "" || value === undefined || value === null ? true : false;
}
let adminUser = "admin@gmail.com";
let adminPassword = "Admin@1234";
function loginUser() {
    let requestBody = {
        "emailId": $("#emailId").val(),
        "password": $("#pwdId").val()
    }
    if (checkIsNull($("#emailId").val()) || checkIsNull($("#pwdId").val())) {
        alert("Please fill Required Data");

    } else if (requestBody.emailId.trim() === adminUser && requestBody.password === adminPassword) {
        localStorage.setItem("userName", "ADMIN");
        window.location.href = "olympicTicket.html";

    } else {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/olympicTicketBookingUserRegister.json",
            //data: JSON.stringify(requestBody),
            success: function (response) {
                let loginUserList = [];
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValid = false;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].emailId == $("#emailId").val() && loginUserList[i].password == $("#pwdId").val()) {
                        isValid = true;
                        localStorage.setItem("userId", loginUserList[i].userId);
                        localStorage.setItem("userData", JSON.stringify(loginUserList[i]));
                        $("#emailId").val('');
                        window.location.href = "olympicTicket.html";

                    }
                }
                if (!isValid) {
                    alert("User not found");
                }

            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}
function registerUser() {
    let requestBody = {
        "memberName": $("#memberNameId").val(),
        "emailId": $("#userEmailId").val(),
        "password": $("#passwordId").val(),
        "contactNum": $("#contactId").val()
    }
    $.ajax({
        type: 'post',
        contentType: "application/json",
        dataType: 'json',
        cache: false,
        url: URL + "/olympicTicketBookingUserRegister.json",
        data: JSON.stringify(requestBody),
        success: function (response) {
            $('#regModelId').modal('hide');
            alert("Registerd sucessfully!!!");
        }, error: function (error) {
            alert("Something went wrong");
        }
    });
}
function registerNewUser() {
    if (checkIsNull($("#memberNameId").val()) || checkIsNull($("#userEmailId").val()) || checkIsNull($("#cpasswordId").val())
        || checkIsNull($("#passwordId").val()) || checkIsNull($("#contactId").val())) {
        alert("Please fill all the required data");

    } else if ($("#passwordId").val() !== $("#cpasswordId").val()) {
        alert("Password and Confirm Password should match");

    } else {

        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/olympicTicketBookingUserRegister.json",
            success: function (response) {

                let loginUserList = [];
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValidEmail = true;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].emailId == $("#userEmailId").val()) {
                        isValidEmail = false;

                    }
                }
                isValidEmail ? registerUser() : alert("Email already registered, Please use other email id !!!");

            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}
$(document).ready(function () {
    $('#regModelId').on('hidden.bs.modal', function (e) {
        $("#memberNameId").val("");
        $("#userEmailId").val("");
        $("#passwordId").val("");
        $("#cpasswordId").val("");
        $("#contactId").val("");
    })
})
