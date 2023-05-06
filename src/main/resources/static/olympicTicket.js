var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    const userId = localStorage.getItem("userId");
    var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/demoproject";
    $scope.userName = localStorage.getItem("userName");
    $scope.orderDetails = {};
    $scope.seatList = [];
    $("#bookTicketDivId").show();
    $("#biilingId").hide();
    $("#addNewTicketDivId").hide();
    getOlympicList();
    $scope.viewOrderTableData = [];

    $scope.onload = function () {
        for (i = 1; i <= 500; i++) {
            $scope.seatList.push(i);
        }
    }
    $scope.placeOrder = function (data) {
        $scope.orderDetails = data;
        $("#bookingDateId").val(data.date);
        $scope.getSeatDetails();
    }
    $scope.addOrder = function () {

        if (checkIsNull($("#contactId").val()) || checkIsNull($("#userEmailId").val())
            || checkIsNull($("#bookingDateId").val()) || checkIsNull($("#seatId").val())) {
            alert("Please fill all the required data");
        } else {
            let reqstBody = {
                "price": $scope.orderDetails.price,
                "orderDate": new Date($("#bookingDateId").val()).toISOString().split('T')[0],
                "status": "pending",
                "contactId": $("#contactId").val(),
                "userEmailId": $("#userEmailId").val(),
                "seatId": $("#seatId").val(),
                "title": $scope.orderDetails.title

            };
            $.ajax({
                type: 'post',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/bookticket/" + userId + ".json",
                data: JSON.stringify(reqstBody),
                success: function (response) {
                    $('#placeOrderModalId').modal('hide');
                    $scope.switchMenu("BILLING", "billingTabId");
                    alert("Operation has been completed sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.getSeatDetails = function (type) {
        let bookList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/bookticket.json",
            success: function (response) {
                for (let data in response) {
                    for (let x in response[data]) {
                        let eventData = response[data][x];
                        eventData["userId"] = data;
                        eventData["childUserId"] = x;
                        bookList.unshift(eventData);
                    }
                }
                const seatNo = [];
                bookList.forEach(function (obj) {
                    seatNo.push(Number(obj.seatId));
                })
                debugger;
                $scope.seatList = [];
                for (i = 1; i <= 500; i++) {
                    if (!seatNo.includes(i)) {
                        $scope.seatList.push(i);
                    }
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }

    $scope.getBookingTableData = function (type) {
        $scope.viewOrderTableData = [];
        let bookList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/bookticket/" + userId + ".json",
            success: function (response) {
                for (let i in response) {
                    let eventData = response[i];
                    eventData["orderId"] = i;
                    bookList.push(eventData);
                }
                const seatNo = [];
                bookList.forEach(function (obj) {
                    seatNo.push(Number(obj.seatId));
                })
                if (type != "BOOKING") {
                    $scope.viewOrderTableData = bookList.filter(function (obj) {
                        if (type == "BILLING") {
                            return obj.status === "pending";
                        } else {
                            return obj.status != "pending";
                        }
                    })
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getOrderData = function (data) {
        $("#ammountId").val(data.price);
        $scope.orderDetails = data;

    }
    $scope.payBill = function () {
        if ($("#paymentModeId").val() == "") {
            alert("Please select payment mode");
        } else {
            let requestBody = {
                "status": $("#paymentModeId").val()
            }
            $.ajax({
                type: 'patch',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/bookticket/" + userId + "/" + $scope.orderDetails.orderId + ".json",
                data: JSON.stringify(requestBody),
                success: function (response) {
                    $('#processToPayModalId').modal('hide');
                    $scope.getBookingTableData("BILLING");
                    alert("Payment sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.logout = function () {
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        localStorage.clear();
        window.location.href = "logReg.html";
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#bookTicketDivId").hide();
        $("#biilingId").hide();
        $("#addNewTicketDivId").hide();
        if (type == "MENU") {
            $("#bookTicketDivId").show();
            getOlympicList();
        } else if (type == "BILLING") {
            $("#biilingId").show();
            $scope.getBookingTableData("BILLING");
        } else if (type == "HISTORY") {
            $("#biilingId").show();
            $scope.userName == 'ADMIN' ? $scope.getAdminTableData() : $scope.getBookingTableData("HISTORY");
        } else if (type = "ADD_MOVIE") {
            $("#addNewTicketDivId").show();
            $("#okympicNameId").val('');
            $("#priceId").val('');
            $('#dateId').val('');
            $("#addressId").val('');
            $('#dateId').attr('min', new Date().toISOString().split('T')[0]);
        }
    }
    function getOlympicList() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addNewOlympicTicket.json",
            success: function (lresponse) {
                $scope.olympicList = [];
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["newMovieId"] = i;
                    $scope.olympicList.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addTicket = function () {
        let requestBody = {
            "date": $("#dateId").val().split('T')[0],
            "price": $("#priceId").val(),
            "title": $("#okympicNameId").val(),
            "address": $("#addressId").val()
        };
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addNewOlympicTicket.json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                alert("Data added sucessfully!!!");
                $("#priceId").val('');
                $("#dateId").val('');
                $("#okympicNameId").val('');
                $("#addressId").val('');
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.removeTicket = function (data) {

        $.ajax({
            type: 'delete',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addNewOlympicTicket/" + data.newMovieId + ".json",
            success: function (response) {
                alert("Removed successfuly !!!");
                getOlympicList();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });

    }
    function checkIsNull(value) {
        return value === "" || value === undefined || value === null ? true : false;
    }
    function resetData() {
        $("#bookingDateId").val("");
        $("#seatId").val("");
        $("#userEmailId").val("");
        $("#passwordId").val("");
        $("#contactId").val("");

    }
    $scope.getAdminTableData = function () {
        $scope.viewOrderTableData = [];
        let olympicList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/bookticket.json",
            success: function (response) {
                for (let data in response) {
                    for (let x in response[data]) {
                        let eventData = response[data][x];
                        eventData["userId"] = data;
                        eventData["childUserId"] = x;
                        olympicList.unshift(eventData);
                    }
                }
                $scope.viewOrderTableData = olympicList;
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $(document).ready(function () {
        $('#placeOrderModalId').on('hidden.bs.modal', function (e) {
            resetData();
        })
    });
});
