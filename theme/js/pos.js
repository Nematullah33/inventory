//On Enter Move the cursor to desigtation Id
function shift_cursor(kevent, target) {

    if (kevent.keyCode == 13) {
        $("#" + target).focus();
    }

}
/*Email validation code*/
function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    } else {
        return false;
    }
}

$("#pay_all").click(function() {
    save(print = true, pay_all = true);
});

function save(print = false, pay_all = false) {

    //$('.make_sale').click(function (e) {

    var base_url = $("#base_url").val().trim();

    if ($(".items_table tr").length == 1) {
        toastr["warning"]("Empty Sales List!!");
        return;
    }


    //RETRIVE ALL DYNAMIC HTML VALUES
    var tot_qty = $(".tot_qty").text();
    var tot_amt = $(".tot_amt").text();
    var tot_disc = $(".tot_disc").text();
    var tot_grand = $(".tot_grand").text();
    var paid_amt = (pay_all) ? tot_grand : $(".sales_div_tot_paid").text();
    var balance = (pay_all) ? 0 : parseFloat($(".sales_div_tot_balance").text());

    /* console.log("tot_grand="+tot_grand);
     console.log("balance="+balance);
     console.log("paid_amt="+paid_amt);
     return;*/
    if ($("#customer_id").val().trim() == 1 && balance != 0) {
        toastr["warning"]("Walk-in Customer Should Pay Complete Amount!!");
        return;
    }
    if (document.getElementById("sales_id")) {
        var command = 'update';
    } else {
        var command = 'save';
    }
    var this_btn = 'make_sale';

    //swal({ title: "Are you sure?",icon: "warning",buttons: true,dangerMode: true,}).then((sure) => {
    //  if(sure) {//confirmation start


    $("#" + this_btn).attr('disabled', true); //Enable Save or Update button
    //e.preventDefault();
    var data = new Array(2);
    data = new FormData($('#pos-form')[0]); //form name
    /*Check XSS Code*/
    if (!xss_validation(data)) { return false; }

    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    $.ajax({
        type: 'POST',
        url: base_url + 'pos/pos_save_update?command=' + command + '&tot_qty=' + tot_qty + '&tot_amt=' + tot_amt + '&tot_disc=' + tot_disc + '&tot_grand=' + tot_grand + "&paid_amt=" + paid_amt + '&balance=' + balance + "&pay_all=" + pay_all,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function(result) {
            //console.log(result);return;
            result = result.trim().split("<<<###>>>");
            console.log("result[0]" + result[0]);
            //return;
            if (result[0]) {

                if (result[0] == "success") {
                    var print_done = true;
                    if (print) {
                        var print_done = window.open(base_url + "pos/print_invoice_pos/" + result[1], "_blank", "scrollbars=1,resizable=1,height=300,width=450");
                    }
                    if (print_done) {

                        if (command == 'update') {
                            console.log("inside update");
                            window.location = base_url + "sales";
                        } else {
                            console.log("inside else");
                            success.currentTime = 0;
                            success.play();
                            toastr['success']("Invoice Saved Successfully!");

                            //window.location=base_url+"pos";		
                            $(".items_table > tbody").empty();
                            $(".discount_input").val(0);

                            $('#multiple-payments-modal').modal('hide');
                            var rc = $("#payment_row_count").val();
                            while (rc > 1) {
                                remove_row(rc);
                                rc--;
                            }
                            console.log('inside form');
                            $("#pos-form")[0].reset();

                            $("#customer_id").val(1).select2();

                            final_total();
                            //get_details();
                            //hold_invoice_list();
                            //window.location=base_url+"pos";

                        }

                    }

                } else if (result[0] == "failed") {
                    toastr['error']("Sorry! Failed to save Record.Try again");
                } else {
                    alert(result);
                }
            } // data.result end

            if (result[2]) {
                $(".search_div").html('');
                $(".search_div").html(result[2]);
            }
            if (result[3]) {
                $("#hold_invoice_list").html('').html(result[3]);
                $(".hold_invoice_list_count").html('').html(result[4]);
            }


            $("." + this_btn).attr('disabled', false); //Enable Save or Update button
            $(".overlay").remove();
        }
    });
    //} //confirmation sure
    //	}); //confirmation end

    //e.preventDefault


    //});
} //Save End

$('#save1,#update1').click(function(e) {

    var base_url = $("#base_url").val().trim();

    if ($(".items_table tr").length == 1) {
        toastr["warning"]("Empty Sales List!!");
        return;
    }


    //RETRIVE ALL DYNAMIC HTML VALUES
    var tot_qty = $(".tot_qty").text();
    var tot_amt = $(".tot_amt").text();
    var tot_disc = $(".tot_disc").text();
    var tot_grand = $(".tot_grand").text();
    var paid_amt = $(".sales_div_tot_paid").text();
    var balance = $(".sales_div_tot_balance").text();



    if (document.getElementById("sales_id")) {
        var command = 'update';
    } else {
        var command = 'save';
    }
    var this_btn = 'place_order';

    swal({ title: "Are you sure?", icon: "warning", buttons: true, dangerMode: true, }).then((sure) => {
        if (sure) { //confirmation start

            e.preventDefault();
            var data = new Array(2);
            data = new FormData($('#pos-form')[0]); //form name
            /*Check XSS Code*/
            if (!xss_validation(data)) { return false; }

            $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
            $("#" + this_btn).attr('disabled', true); //Enable Save or Update button
            $.ajax({
                type: 'POST',
                url: base_url + 'pos/pos_save_update?command=' + command + '&tot_qty=' + tot_qty + '&tot_amt=' + tot_amt + '&tot_disc=' + tot_disc + '&tot_grand=' + tot_grand + "&paid_amt=" + paid_amt + '&balance=' + balance + "&by_cash=" + true,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function(result) {
                    //alert(result);//return;

                    result = result.trim().split("<<<###>>>");

                    if (result[0] == "success") {
                        //window.location=base_url+"pos/print_invoice_pos/"+result[1]+"?redirect=pos", "_blank";
                        //window.location=base_url+"sales/print_invoice/"+result[1];
                        //window.open(base_url+"pos/print_invoice_pos/"+result[1], "_blank");
                        if (window.open(base_url + "pos/print_invoice_pos/" + result[1], "_blank", "scrollbars=1,resizable=1,height=300,width=450")) {
                            if (command == 'update') {
                                window.location = base_url + "sales";
                            } else {
                                window.location = base_url + "pos";
                            }
                        }

                    } else if (result[0] == "failed") {
                        toastr['error']("Sorry! Failed to save Record.Try again");
                    } else {
                        alert(result);
                    }

                    $("#" + this_btn).attr('disabled', false); //Enable Save or Update button
                    $(".overlay").remove();
                }
            });
        } //confirmation sure
    }); //confirmation end

    //e.preventDefault


});


/* *********************** HOLD INVOICE START****************************/
$('#hold_invoice').click(function(e) {

    //table should not be empty
    if ($(".items_table tr").length == 1) {
        toastr["error"]("Please Select Items from List!!");
        failed.currentTime = 0;
        failed.play();
        return;
    }

    swal({
            title: "Hold Invoice ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Please Enter Reference Number!",
                    type: "text",

                    inputAttributes: {
                        maxlength: '5'
                    }
                },
            },
        }).then(name => {
            //If input box blank Throw Error
            if (!name.trim()) { throw null; return false; }
            var reference_id = name;
            /* ********************************************************** */
            var base_url = $("#base_url").val().trim();

            //RETRIVE ALL DYNAMIC HTML VALUES
            var tot_qty = $(".tot_qty").text();
            var tot_amt = $(".tot_amt").text();
            var tot_disc = $(".tot_disc").text();
            var tot_grand = $(".tot_grand").text();
            var hidden_rowcount = $("#hidden_rowcount").val();

            var this_id = this.id; //id=save or id=update

            e.preventDefault();
            data = new FormData($('#pos-form')[0]); //form name
            /*Check XSS Code*/
            if (!xss_validation(data)) { return false; }

            $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
            $("#" + this_id).attr('disabled', true); //Enable Save or Update button				
            $.ajax({
                type: 'POST',
                url: base_url + 'pos/hold_invoice?command=' + this_id + '&tot_qty=' + tot_qty + '&tot_amt=' + tot_amt + '&tot_disc=' + tot_disc + '&tot_grand=' + tot_grand + "&reference_id=" + reference_id,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function(result) {
                    //alert(result);return;
                    $("#hidden_invoice_id").val('');
                    result = result.trim().split("<<<###>>>");

                    if (result[0] == "success") {
                        $('#pos-form-tbody').html('');
                        //CALCULATE FINAL TOTAL AND OTHER OPERATIONS
                        final_total();

                        hold_invoice_list();
                        success.currentTime = 0;
                        success.play();
                    } else if (result[0] == "failed") {
                        toastr['error']("Sorry! Failed to save Record.Try again");
                    } else {
                        alert(result);
                    }

                    $("#" + this_id).attr('disabled', false); //Enable Save or Update button
                    $(".overlay").remove();
                }
            });
            /* ********************************************************** */

        }) //name end
        .catch(err => {
            toastr['error']("Failed!! Invoice Not Saved! <br/>Please Enter Reference Number");
            failed.currentTime = 0;
            failed.play();
        }); //swal end

}); //hold_invoice end

function hold_invoice_list() {
    var base_url = $("#base_url").val().trim();
    $.post(base_url + "pos/hold_invoice_list", {}, function(result) {
        //alert(result);
        var data = jQuery.parseJSON(result)
        $("#hold_invoice_list").html('').html(data['result']);
        $(".hold_invoice_list_count").html('').html(data['tot_count']);
    });
}

function hold_invoice_delete(invoice_id) {
    swal({ title: "Are you sure?", icon: "warning", buttons: true, dangerMode: true, }).then((sure) => {
        if (sure) { //confirmation start
            var base_url = $("#base_url").val().trim();
            $.post(base_url + "pos/hold_invoice_delete/" + invoice_id, {}, function(result) {
                result = result.trim();
                if (result == 'success') {
                    toastr["success"]("Success! Invoice Deleted!!");
                    success.currentTime = 0;
                    success.play();
                    hold_invoice_list();
                } else {
                    toastr['error']("Failed to Delete Invoice! Try again!!");
                    failed.currentTime = 0;
                    failed.play();
                }
            });
        } //confirmation sure
    }); //confirmation end
}

function hold_invoice_edit(invoice_id) {

    swal({ title: "Are you sure?", icon: "warning", buttons: true, dangerMode: true, }).then((sure) => {
        if (sure) { //confirmation start
            var base_url = $("#base_url").val().trim();

            $.post(base_url + "pos/hold_invoice_edit?invoice_id=" + invoice_id, {}, function(result) {
                //alert(result);
                $("#hidden_invoice_id").val(invoice_id);

                var data = jQuery.parseJSON(result)

                if (data.length > 0) {
                    //	Make empty table list
                    $('#pos-form-tbody').html('');
                    for (k = 0; k < data.length; k++) {
                        var item_id = data[k]['item_id'];
                        var item_qty = data[k]['item_qty'];
                        for (j = 1; j <= item_qty; j++) {
                            addrow(item_id);
                        }
                    }
                    //CALCULATE FINAL TOTAL AND OTHER OPERATIONS
                    final_total();

                    hold_invoice_list();
                    success.currentTime = 0;
                    success.play();
                }
            });


        } //confirmation sure
    }); //confirmation end
}
/* *********************** HOLD INVOICE END****************************/
/* *********************** ORDER INVOICE START****************************/
function get_id_value(id) {
    return $("#" + id).val().trim();
}
$('#collect_customer_info').click(function(e) {

    //table should not be empty
    if ($(".items_table tr").length == 1) {
        toastr["error"]("Please Select Items from List!!");
        failed.currentTime = 0;
        failed.play();
        return;
    }
    if (get_id_value('customer_id') == 1) {
        //$('#customer-modal').modal('toggle');
        toastr["error"]("Please Select Customer!!");
        failed.currentTime = 0;
        failed.play();
        return false;
    } else {
        $('#delivery-info').modal('toggle');
    }
}); //hold_invoice end
$('.show_payments_modal').click(function(e) {

    //table should not be empty
    if ($(".items_table tr").length == 1) {
        toastr["error"]("Please Select Items from List!!");
        failed.currentTime = 0;
        failed.play();
        return;
    } else {
        adjust_payments();
        $("#add_payment_row,#payment_type_1").parent().show();
        $("#amount_1").parent().parent().removeClass('col-md-12').addClass('col-md-6');
        $('#multiple-payments-modal').modal('toggle');
    }
}); //hold_invoice end
$('#show_cash_modal').click(function(e) {
    //table should not be empty
    if ($(".items_table tr").length == 1) {
        toastr["error"]("Please Select Items from List!!");
        failed.currentTime = 0;
        failed.play();
        return;
    } else {
        adjust_payments();
        $("#add_payment_row,#payment_type_1").parent().hide();
        $("#amount_1").focus();
        $("#amount_1").parent().parent().removeClass('col-md-6').addClass('col-md-12');
        $('#multiple-payments-modal').modal('toggle');
    }
}); //hold_invoice end

$('#add_payment_row').click(function(e) {

    var base_url = $("#base_url").val().trim();
    //table should not be empty
    if ($(".items_table tr").length == 1) {
        toastr["error"]("Please Select Items from List!!");
        failed.currentTime = 0;
        failed.play();
        return;
    }
    /*if(get_id_value('customer_id')==1){
    	//$('#customer-modal').modal('toggle');
    	toastr["error"]("Please Select Customer!!");
    	failed.currentTime = 0;
failed.play();
    	return false;
    }*/
    else {
        /*BUTTON LOAD AND DISABLE START*/
        var this_id = this.id;
        var this_val = $(this).html();
        $("#" + this_id).html('<i class="fa fa-spinner fa-spin"></i> Please Wait..');
        $("#" + this_id).attr('disabled', true);
        /*BUTTON LOAD AND DISABLE END*/

        var payment_row_count = get_id_value("payment_row_count");
        $.post(base_url + "pos/add_payment_row", { payment_row_count: payment_row_count }, function(result) {
            $('.payments_div').parent().append(result);

            $("#payment_row_count").val(parseFloat(payment_row_count) + 1);

            /*BUTTON LOAD AND DISABLE START*/
            $("#" + this_id).html(this_val);
            $("#" + this_id).attr('disabled', false);
            /*BUTTON LOAD AND DISABLE END*/
            failed.currentTime = 0;
            failed.play();
            adjust_payments();
        });
    }
}); //hold_invoice end
function remove_row(id) {
    $(".payments_div_" + id).html('');
    failed.currentTime = 0;
    failed.play();
    adjust_payments();
}

function calculate_payments() {
    adjust_payments();
}
/* *********************** ORDER INVOICE END****************************/
//On Enter Move the cursor to desigtation Id
function shift_cursor(kevent, target) {

    if (kevent.keyCode == 13) {
        $("#" + target).focus();
    }

}


$('#save,#update').click(function(e) {
    var base_url = $("#base_url").val().trim();

    //Initially flag set true
    var flag = true;

    function check_field(id) {

        if (!$("#" + id).val().trim()) //Also check Others????
        {

            $('#' + id + '_msg').fadeIn(200).show().html('Required Field').addClass('required');
            // $('#'+id).css({'background-color' : '#E8E2E9'});
            flag = false;
        } else {
            $('#' + id + '_msg').fadeOut(200).hide();
            //$('#'+id).css({'background-color' : '#FFFFFF'});    //White color
        }
    }


    //Validate Input box or selection box should not be blank or empty
    check_field("customer_id");
    check_field("sales_date");
    check_field("sales_status");
    //check_field("warehouse_id");
    /*if(!isNaN($("#amount").val().trim()) && parseFloat($("#amount").val().trim())==0){
          toastr["error"]("You have entered Payment Amount! <br>Please Select Payment Type!");
          return;
      }*/
    if (flag == false) {
        toastr["error"]("You have missed Something to Fillup!");
        return;
    }

    //Atleast one record must be added in sales table 
    var rowcount = document.getElementById("hidden_rowcount").value;
    var flag1 = false;
    for (var n = 1; n <= rowcount; n++) {
        if ($("#td_data_" + n + "_3").val() != null && $("#td_data_" + n + "_3").val() != '') {
            flag1 = true;
        }
    }

    if (flag1 == false) {
        toastr["warning"]("Please Select Item!!");
        $("#item_search").focus();
        return;
    }
    //end

    if ($("#customer_id").val().trim() == 1) {
        if (parseFloat($("#total_amt").text()) != parseFloat($("#amount").val())) {
            $("#amount").focus();
            toastr["warning"]("Walk-in Customer Should Pay Complete Amount!!");
            return;
        }
        if ($("#payment_type").val() == '') {
            toastr["warning"]("Please Select Payment Type!!");
            return;
        }
    }

    var tot_subtotal_amt = $("#subtotal_amt").text();
    var other_charges_amt = $("#other_charges_amt").text(); //other_charges include tax calcualated amount
    var tot_discount_to_all_amt = $("#discount_to_all_amt").text();
    var tot_round_off_amt = $("#round_off_amt").text();
    var tot_total_amt = $("#total_amt").text();

    var this_id = this.id;

    //if(confirm("Do You Wants to Save Record ?")){
    e.preventDefault();
    data = new FormData($('#sales-form')[0]); //form name
    /*Check XSS Code*/
    if (!xss_validation(data)) { return false; }

    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    $("#" + this_id).attr('disabled', true); //Enable Save or Update button
    $.ajax({
        type: 'POST',
        url: base_url + 'sales/sales_save_and_update?command=' + this_id + '&rowcount=' + rowcount + '&tot_subtotal_amt=' + tot_subtotal_amt + '&tot_discount_to_all_amt=' + tot_discount_to_all_amt + '&tot_round_off_amt=' + tot_round_off_amt + '&tot_total_amt=' + tot_total_amt + "&other_charges_amt=" + other_charges_amt,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function(result) {
            // alert(result);return;
            result = result.split("<<<###>>>");
            if (result[0] == "success") {
                location.href = base_url + "sales/invoice/" + result[1];
            } else if (result[0] == "failed") {
                toastr['error']("Sorry! Failed to save Record.Try again");
            } else {
                alert(result);
            }
            $("#" + this_id).attr('disabled', false); //Enable Save or Update button
            $(".overlay").remove();

        }
    });
    //}

});


$("#item_search").bind("paste", function(e) {
    $("#item_search").autocomplete('search');
});
$("#item_search").autocomplete({
    source: function(data, cb) {
        $.ajax({
            autoFocus: true,
            url: $("#base_url").val() + 'items/get_json_items_details',
            method: 'GET',
            dataType: 'json',
            /*showHintOnFocus: true,
            autoSelect: true, 
      
            selectInitial :true,*/

            data: {
                name: data.term,
                /*warehouse_id:$("#warehouse_id").val().trim(),*/
            },
            success: function(res) {
                //console.log(res);
                var result;
                result = [{
                    //label: 'No Records Found '+data.term,
                    label: 'No Records Found ',
                    value: ''
                }];

                if (res.length) {
                    result = $.map(res, function(el) {
                        return {
                            label: el.item_code + '--[Qty:' + el.stock + '] --' + el.label,
                            value: '',
                            id: el.id,
                            item_name: el.value,
                            stock: el.stock,
                            // mobile: el.mobile,
                            //customer_dob: el.customer_dob,
                            //address: el.address,
                        };
                    });
                }

                cb(result);
            }
        });
    },
    response: function(e, ui) {
        if (ui.content.length == 1) {
            $(this).data('ui-autocomplete')._trigger('select', 'autocompleteselect', ui);
            $(this).autocomplete("close");
        }
        //console.log(ui.content[0].id);
    },
    //loader start
    search: function(e, ui) {},
    select: function(e, ui) {

        //$("#mobile").val(ui.item.mobile)
        //$("#item_search").val(ui.item.value);
        //$("#customer_dob").val(ui.item.customer_dob)
        //$("#address").val(ui.item.address)
        //alert("id="+ui.item.id);

        if (typeof ui.content != 'undefined') {
            console.log("Autoselected first");
            if (isNaN(ui.content[0].id)) {
                return;
            }
            var stock = ui.content[0].stock;
            var item_id = ui.content[0].id;
        } else {
            console.log("manual Selected");
            var stock = ui.item.stock;
            var item_id = ui.item.id;
        }
        if (parseFloat(stock) <= 0) {
            toastr["warning"](stock + " Items in Stock!!");
            failed.currentTime = 0;
            failed.play();
            return false;
        }
        if (restrict_quantity(item_id)) {
            return_row_with_data(item_id);
        }
        $("#item_search").val('');

    },
    //loader end
});

function return_row_with_data(item_id) {
    $("#item_search").addClass('ui-autocomplete-loader-center');
    var base_url = $("#base_url").val().trim();
    var rowcount = $("#hidden_rowcount").val();
    $.post(base_url + "sales/return_row_with_data/" + rowcount + "/" + item_id, {}, function(result) {
        //alert(result);
        $('#sales_table tbody').append(result);
        $("#hidden_rowcount").val(parseFloat(rowcount) + 1);
        success.currentTime = 0;
        success.play();
        enable_or_disable_item_discount();
        $("#item_search").removeClass('ui-autocomplete-loader-center');
    });
}
//INCREMENT ITEM
function increment_qty(rowcount) {

    var flag = restrict_quantity($("#tr_item_id_" + rowcount).val().trim());
    if (!flag) { return false; }

    var item_qty = $("#td_data_" + rowcount + "_3").val();
    var available_qty = $("#tr_available_qty_" + rowcount + "_13").val();
    if (parseFloat(item_qty) < parseFloat(available_qty)) {
        item_qty = parseFloat(item_qty) + 1;
        $("#td_data_" + rowcount + "_3").val(item_qty);
    }
    calculate_tax(rowcount);
}
//DECREMENT ITEM
function decrement_qty(rowcount) {
    var item_qty = $("#td_data_" + rowcount + "_3").val();
    if (item_qty <= 1) {
        $("#td_data_" + rowcount + "_3").val(1);
        return;
    }
    $("#td_data_" + rowcount + "_3").val(parseFloat(item_qty) - 1);
    calculate_tax(rowcount);
}

function update_paid_payment_total() {
    var rowcount = $("#paid_amt_tot").attr("data-rowcount");
    var tot = 0;
    for (i = 1; i < rowcount; i++) {
        if (document.getElementById("paid_amt_" + i)) {
            tot += parseFloat($("#paid_amt_" + i).html());
        }
    }
    $("#paid_amt_tot").html(tot.toFixed(2));
}

function delete_payment(payment_id) {
    if (confirm("Do You Wants to Delete Record ?")) {
        var base_url = $("#base_url").val().trim();
        $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
        $.post(base_url + "sales/delete_payment", { payment_id: payment_id }, function(result) {
            //alert(result);return;
            result = result.trim();
            if (result == "success") {
                toastr["success"]("Record Deleted Successfully!");
                $("#payment_row_" + payment_id).remove();
                success.currentTime = 0;
                success.play();
            } else if (result == "failed") {
                toastr["error"]("Failed to Delete .Try again!");
                failed.currentTime = 0;
                failed.play();
            } else {
                toastr["error"](result);
                failed.currentTime = 0;
                failed.play();
            }
            $(".overlay").remove();
            update_paid_payment_total();
        });
    } //end confirmation   
}

//Delete Record start
function delete_sales(q_id) {

    if (confirm("Do You Wants to Delete Record ?")) {
        $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
        $.post("sales/delete_sales", { q_id: q_id }, function(result) {
            //alert(result);return;
            if (result == "success") {
                toastr["success"]("Record Deleted Successfully!");
                $('#example2').DataTable().ajax.reload();
            } else if (result == "failed") {
                toastr["error"]("Failed to Delete .Try again!");
            } else {
                toastr["error"](result);
            }
            $(".overlay").remove();
            return false;
        });
    } //end confirmation
}
//Delete Record end
function multi_delete() {
    //var base_url=$("#base_url").val().trim();
    var this_id = this.id;

    if (confirm("Are you sure ?")) {
        data = new FormData($('#table_form')[0]); //form name
        /*Check XSS Code*/
        if (!xss_validation(data)) { return false; }

        $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
        $("#" + this_id).attr('disabled', true); //Enable Save or Update button
        $.ajax({
            type: 'POST',
            url: 'sales/multi_delete',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                result = result.trim();
                //alert(result);return;
                if (result == "success") {
                    toastr["success"]("Record Deleted Successfully!");
                    success.currentTime = 0;
                    success.play();
                    $('#example2').DataTable().ajax.reload();
                    $(".delete_btn").hide();
                    $(".group_check").prop("checked", false).iCheck('update');
                } else if (result == "failed") {
                    toastr["error"]("Sorry! Failed to save Record.Try again!");
                    failed.currentTime = 0;
                    failed.play();
                } else {
                    toastr["error"](result);
                    failed.currentTime = 0;
                    failed.play();
                }
                $("#" + this_id).attr('disabled', false); //Enable Save or Update button
                $(".overlay").remove();
            }
        });
    }
    //e.preventDefault
}

function pay_now(sales_id) {
    $.post('sales/show_pay_now_modal', { sales_id: sales_id }, function(result) {
        $(".pay_now_modal").html('').html(result);
        //Date picker
        $('.datepicker').datepicker({
            autoclose: true,
            format: 'dd-mm-yyyy',
            todayHighlight: true
        });
        $('#pay_now').modal('toggle');

    });
}

function view_payments(sales_id) {
    $.post('sales/view_payments_modal', { sales_id: sales_id }, function(result) {
        $(".view_payments_modal").html('').html(result);
        $('#view_payments_modal').modal('toggle');
    });
}

function save_payment(sales_id) {
    var base_url = $("#base_url").val().trim();

    //Initially flag set true
    var flag = true;

    function check_field(id) {

        if (!$("#" + id).val().trim()) //Also check Others????
        {

            $('#' + id + '_msg').fadeIn(200).show().html('Required Field').addClass('required');
            // $('#'+id).css({'background-color' : '#E8E2E9'});
            flag = false;
        } else {
            $('#' + id + '_msg').fadeOut(200).hide();
            //$('#'+id).css({'background-color' : '#FFFFFF'});    //White color
        }
    }


    //Validate Input box or selection box should not be blank or empty
    check_field("amount");
    check_field("payment_date");


    var payment_date = $("#payment_date").val().trim();
    var amount = $("#amount").val().trim();
    var payment_type = $("#payment_type").val().trim();
    var payment_note = $("#payment_note").val().trim();

    if (amount == 0) {
        toastr["error"]("Please Enter Valid Amount!");
        return false;
    }

    if (amount > parseFloat($("#due_amount_temp").html().trim())) {
        toastr["error"]("Entered Amount Should not be Greater than Due Amount!");
        return false;
    }

    $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    $(".payment_save").attr('disabled', true); //Enable Save or Update button
    $.post('sales/save_payment', { sales_id: sales_id, payment_type: payment_type, amount: amount, payment_date: payment_date, payment_note: payment_note }, function(result) {
        result = result.trim();
        //alert(result);return;
        if (result == "success") {
            $('#pay_now').modal('toggle');
            toastr["success"]("Payment Recorded Successfully!");
            success.currentTime = 0;
            success.play();
            $('#example2').DataTable().ajax.reload();
        } else if (result == "failed") {
            toastr["error"]("Sorry! Failed to save Record.Try again!");
            failed.currentTime = 0;
            failed.play();
        } else {
            toastr["error"](result);
            failed.currentTime = 0;
            failed.play();
        }
        $(".payment_save").attr('disabled', false); //Enable Save or Update button
        $(".overlay").remove();
    });
}

function delete_sales_payment(payment_id) {
    if (confirm("Do You Wants to Delete Record ?")) {
        var base_url = $("#base_url").val().trim();
        $(".box").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
        $.post(base_url + "sales/delete_payment", { payment_id: payment_id }, function(result) {
            //alert(result);return;
            result = result.trim();
            if (result == "success") {
                $('#view_payments_modal').modal('toggle');
                toastr["success"]("Record Deleted Successfully!");
                success.currentTime = 0;
                success.play();
                $('#example2').DataTable().ajax.reload();
            } else if (result == "failed") {
                toastr["error"]("Failed to Delete .Try again!");
                failed.currentTime = 0;
                failed.play();
            } else {
                toastr["error"](result);
                failed.currentTime = 0;
                failed.play();
            }
            $(".overlay").remove();
        });
    } //end confirmation   
}

function restrict_quantity(item_id) {
    var rowcount = $("#hidden_rowcount").val();
    var available_qty = 0;
    var count_item_qty = 0;
    var selected_item_id = 0;
    for (i = 1; i <= rowcount; i++) {
        if (document.getElementById("tr_item_id_" + i)) {
            selected_item_id = $("#tr_item_id_" + i).val().trim();
            if (parseFloat(item_id) == parseFloat(selected_item_id)) {
                available_qty = parseFloat($("#tr_available_qty_" + i + "_13").val().trim());
                count_item_qty += parseFloat($("#td_data_" + i + "_3").val().trim());
            }
        }
    } //end for
    if (available_qty != 0 && count_item_qty >= available_qty) {
        toastr["warning"]("Only " + available_qty + " Items in Stock!!");
        failed.currentTime = 0;
        failed.play();
        return false;
    }
    return true;
}

/*$("#warehouse_id").change(function(event) {
  $('#sales_table tbody').html('');
  final_total();
  if($("#warehouse_id").val().trim()!=''){
    $("#item_search").attr({ disabled: false,});
  }
  else{
   $("#item_search").attr({ disabled: true,}); 
  }
});*/