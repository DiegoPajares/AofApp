// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    swipeBackPage: false,
    swipeBackPageThreshold: 1,
    swipePanel: "left",
    swipePanelCloseOpposite: true,
    pushState: true,
    pushStateRoot: undefined,
    pushStateNoAnimation: false,
    pushStateSeparator: '#!/',
    template7Pages: true
});


// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});


$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

myApp.onPageInit('index', function (page) {
    if (login == 1) {
        console.log("Logueado");
    }

});

myApp.onPageInit('asistencia', function (page) {

    var idAsistencia;
    var dni;
    var idjefe;
    app.initialize();
    $.ajax({
        url: "http://www.pycsolutions.com/aofintranet/Appmovil/Asistencia/creaasistencia?idusuario=" + idUsuario,
//        url: "http://localhost/IntranetAof/Appmovil/Asistencia/creaasistencia?idusuario=" + idUsuario,
        type: "GET",
        dataType: 'json',
        beforeSend: function ()
        {
//                            $.LoadingOverlay("show");
        },
        success: function (data)
        {
            if (data != null) {
                idAsistencia = data;
            } else {
                myApp.alert('Vuelva a intentar...', 'Hubo un error!');
                window.location.replace("index.html");
            }
        },
        error: function (e)
        {
            myApp.alert('Revise su conexion a internet', 'Hubo un error!');
        }
    });
    $.ajax({
        url: "http://www.pycsolutions.com/aofintranet/Appmovil/Asistencia/trabajadores_jefes_lista",
//        url: "http://localhost/intranetaof/appmovil/asistencia/trabajadores_jefes_lista",
        dataType: 'json',
        type: 'GET',
        beforeSend: function () {
        },
        success: function (response) {
            var html = "";
            html += '<option value="0">Elija un Encargado</option>';
            $(response).each(function (i, jefe) {
                html += '<option value="' + jefe.id + '">' + jefe.nombres + ' ' + jefe.apellido_p + ' ' + jefe.apellido_m + '</option>';
            });
            $("#cmbJefe").html(html);
        },
        error: function (response) {
            console.log("Error");
        }
    });

    $("#btnEscanear").click(function () {

        idjefe = $("#cmbJefe").val();
        if (idjefe != 0) {
            cordova.plugins.barcodeScanner.scan(
                    function (result) {
//                    alert("Codigo \n Nro DNI: " + result.text + "\n");
                        //"Formato: " + result.format + "\n" +
                        //"Cancelado: " + result.cancelled);                    
                        $("#txtDniMarcacion").val(result.text);
                        dni = result.text;
                        $.ajax({
                            url: "http://www.pycsolutions.com/aofintranet/Appmovil/Asistencia/insertaasistencia?idasistencia=" + idAsistencia + "&dni=" + dni + "&idJefe=" + idjefe,
//            url: "http://localhost/IntranetAof/Appmovil/Asistencia/insertaasistencia?idasistencia=" + idAsistencia + "&dni=" + dni,
                            type: "GET",
                            dataType: 'json',
                            beforeSend: function ()
                            {
//                            $.LoadingOverlay("show");
                            },
                            success: function (data)
                            {

                                if (data != null) {
                                    if (data == 0) {
                                        myApp.alert('DNI incorrecto o no tiene asignación.', 'Hubo un error!');
                                        $("#txtDniMarcacion").val(null);
                                    } else if (data == 2) {
                                        myApp.alert('Ya se ha registrado la asistencia del trabajador anteriormente.', 'Hubo un error!');
                                        $("#txtDniMarcacion").val(null);
                                    } else if (data == 1) {
                                        myApp.alert('Asistencia registrada.', 'Exito!');
                                        $("#txtDniMarcacion").val(null);
                                    }
                                } else {
                                    myApp.alert('Vuelva a intentar...', 'Hubo un error!');
                                }
                            },
                            error: function (e)
                            {
                                myApp.alert('Revise su conexion a internet', 'Hubo un error!');
                            }
                        });
                    },
                    function (error) {
                        alert("Error de lectura: " + error);
                        dni = null;
                    }
            );
        }else{
            alert("No selecciono el encargado correctamente.");
        }
        console.log("ready");
    });

});

$$(document).on('pageInit', function (e) {

    $(".swipebox").swipebox();
    $("#ContactForm").validate({
        submitHandler: function (form) {
            ajaxContact(form);
            return false;
        }
    });

    $("#RegisterForm").validate();
    $("#LoginForm").validate();
    $("#ForgotForm").validate();

    $('a.backbutton').click(function () {
        parent.history.back();
        return false;
    });


    $(".posts li").hide();
    size_li = $(".posts li").size();
    x = 4;
    $('.posts li:lt(' + x + ')').show();
    $('#loadMore').click(function () {
        x = (x + 1 <= size_li) ? x + 1 : size_li;
        $('.posts li:lt(' + x + ')').show();
        if (x == size_li) {
            $('#loadMore').hide();
            $('#showLess').show();
        }
    });


    $("a.switcher").bind("click", function (e) {
        e.preventDefault();

        var theid = $(this).attr("id");
        var theproducts = $("ul#photoslist");
        var classNames = $(this).attr('class').split(' ');


        if ($(this).hasClass("active")) {
            // if currently clicked button has the active class
            // then we do nothing!
            return false;
        } else {
            // otherwise we are clicking on the inactive button
            // and in the process of switching views!

            if (theid == "view13") {
                $(this).addClass("active");
                $("#view11").removeClass("active");
                $("#view11").children("img").attr("src", "images/switch_11.png");

                $("#view12").removeClass("active");
                $("#view12").children("img").attr("src", "images/switch_12.png");

                var theimg = $(this).children("img");
                theimg.attr("src", "images/switch_13_active.png");

                // remove the list class and change to grid
                theproducts.removeClass("photo_gallery_11");
                theproducts.removeClass("photo_gallery_12");
                theproducts.addClass("photo_gallery_13");

            } else if (theid == "view12") {
                $(this).addClass("active");
                $("#view11").removeClass("active");
                $("#view11").children("img").attr("src", "images/switch_11.png");

                $("#view13").removeClass("active");
                $("#view13").children("img").attr("src", "images/switch_13.png");

                var theimg = $(this).children("img");
                theimg.attr("src", "images/switch_12_active.png");

                // remove the list class and change to grid
                theproducts.removeClass("photo_gallery_11");
                theproducts.removeClass("photo_gallery_13");
                theproducts.addClass("photo_gallery_12");

            } else if (theid == "view11") {
                $("#view12").removeClass("active");
                $("#view12").children("img").attr("src", "images/switch_12.png");

                $("#view13").removeClass("active");
                $("#view13").children("img").attr("src", "images/switch_13.png");

                var theimg = $(this).children("img");
                theimg.attr("src", "images/switch_11_active.png");

                // remove the list class and change to grid
                theproducts.removeClass("photo_gallery_12");
                theproducts.removeClass("photo_gallery_13");
                theproducts.addClass("photo_gallery_11");

            }

        }

    });


})

myApp.onPageInit('autocomplete', function (page) {
    var fruits = ('Apple Apricot Avocado Banana Melon Orange Peach Pear Pineapple').split(' ');
    var autocompleteDropdownSimple = myApp.autocomplete({
        input: '#autocomplete-dropdown',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0)
                    results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });
});
