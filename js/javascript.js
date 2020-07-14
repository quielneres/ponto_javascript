$(document).ready(function() {
    /*$('#msgs').html('Press TAB to move to the next field').show();*/
    $("input", $('.inputLine:first')).val("00");
    $("input:last", $('.inputLine:first')).val("00:00");
    var lineHtml = $('.inputLine:first').html();
    $("#rate").focus(function() {
        if ($(this).val() == "enter here") {
            $(this).val("")
        }
    }).blur(function() {
        if ($(this).val() == "") {
            $(this).val("enter here")
        } else {
            $(this).val(parseFloat($(this).val()).toFixed(2))
        }
        $("#calculate").click()
    });
    $('.rows span').click(function() {
        var currentLines = $(".inputLine").length;
        var toLines = $(this).attr("rel");
        if (currentLines <= toLines) {
            var diffLines = toLines - currentLines;
            var thisLine = [];
            if ($(this).attr('rell') != 'w') {
                for (var i = 0; i < diffLines; i++) {
                    thisLine.push("<tr class='inputLine'>" + lineHtml + "</tr>")
                }
            } else {
                for (var i = 0; i < diffLines; i++) {
                    thisLine.push('<table cellspacing="2" cellpadding="0" class="table inputLine">' + lineHtml + '</table>')
                }
            }
            $("#enter_time .lineTarget").append(thisLine.join(''))
        } else {
            var diffLines = currentLines - toLines;
            for (var i = 0; i < diffLines; i++) {
                $(".inputLine:last").remove()
            }
        }
        $(".listNum").each(function(i) {
            $(this).html(i + 1)
        });
        $(".inputLine input.yellow_inputbox").click(function() {
            if (parseInt($(this).val(), 10) == 0) {
                $(this).val("")
            }
        }).blur(function() {
            if (parseInt($(this).val(), 10) > 0) {
                if ($(this).attr("class").indexOf("hour") != -1 && parseInt($(this).val(), 10) > 24) {
                    $(this).val(00)
                } else if ($(this).attr("class").indexOf("minute") != -1 && parseInt($(this).val(), 10) > 60) {
                    $(this).val(60)
                } else {
                    if ($(this).val() == 0) {
                        $(this).val("00")
                    } else if (parseInt($(this).val(), 10) < 10) {
                        $(this).val("0" + parseInt($(this).val(), 10))
                    }
                }
            } else {
                $(this).val("00")
            }
            $("#calculate").click()
        });
        $("select").blur(function() {
            $("#calculate").click()
        });
        $(".listfield").keydown(function(e) {
            if (e.keyCode == 9) {
                var inputs = $(".listfield");
                var idx = inputs.index(this);
                if (idx == inputs.length - 1) {} else {
                    var thisElement = inputs[idx + 1];
                    if ($(thisElement).attr("class").indexOf("gray_input") != -1) {
                        thisElement = inputs[idx + 2];
                        if ($(thisElement).attr("class").indexOf("gray_input") != -1) {
                            thisElement = inputs[idx + 3]
                        }
                    }
                    $(thisElement).focus();
                    $(thisElement).select()
                }
                return false
            }
        })
    });
    $(".rows span:first").click();
    $("#calculate").click(function() {
        var sh = 0;
        var sm = 0;
        var eh = 0;
        var em = 0;
        var totalDiff = 0;
        $(".inputLine").each(function(i) {
            var thisLine = $(this);
            var diffMin = 0;
            var sh = parseInt($(".yellow_inputbox:eq(0)", this).val(), 10);
            var sm = parseInt($(".yellow_inputbox:eq(1)", this).val(), 10);
            var eh = parseInt($(".yellow_inputbox:eq(2)", this).val(), 10);
            var em = parseInt($(".yellow_inputbox:eq(3)", this).val(), 10);
            var ssh = parseInt($(".yellow_inputbox:eq(4)", this).val(), 10);
            var ssm = parseInt($(".yellow_inputbox:eq(5)", this).val(), 10);
            var eeh = parseInt($(".yellow_inputbox:eq(6)", this).val(), 10);
            var eem = parseInt($(".yellow_inputbox:eq(7)", this).val(), 10);
            if ((sh > 0 && eh > 0)) {
                var time1 = parseInt(sh * 60 + sm, 10);
                var time2 = parseInt(eh * 60 + em, 10);
                if (time1 < time2) {
                    diffMin += parseInt(time2 - time1, 10)
                } else {
                    diffMin += parseInt(24 * 60 - parseInt(time1 - time2, 10), 10)
                }
            }
            if (ssh > 0 && eeh > 0) {
                var time1 = parseInt(ssh * 60 + ssm, 10);
                var time2 = parseInt(eeh * 60 + eem, 10);
                if (time1 < time2) {
                    diffMin += parseInt(time2 - time1, 10)
                } else {
                    diffMin += parseInt(24 * 60 - parseInt(time1 - time2, 10), 10)
                }
            }
            if (diffMin > 0) {
                totalDiff = parseInt(totalDiff + diffMin, 10);
                var newHour = parseInt(diffMin / 60, 10);
                var newMin = parseInt(diffMin % 60, 10);
                if (newHour < 10) {
                    newHour = "0" + newHour
                }
                if (newMin < 10) {
                    newMin = "0" + newMin
                }
                $(".gray_inputbox", this).val(newHour + ":" + newMin)
            }
        });
        var totalHour = parseInt(totalDiff / 60, 10);
        var totalMin = parseInt(totalDiff % 60, 10);
        if (totalHour < 10) {
            totalHour = "0" + totalHour
        }
        if (totalMin < 10) {
            totalMin = "0" + totalMin
        }
        $("#total").val(totalHour + ":" + totalMin);
        if (parseFloat($("#rate").val()) > 0) {
            $("#totalPay").val((totalDiff / 60 * parseFloat($("#rate").val())).toFixed(2))
        } else {
            $("#totalPay").val("0")
        }
    });
    $('#date').datepick({
        dateFormat: 'mm/dd/yy'
    });
    $("#clearAll").click(function() {
        $("#calc")[0].reset()
    });
    $("#print").click(function() {
        var result = [];
        $(".inputLine").each(function() {
            $("input,select", this).each(function(i) {
                result.push($(this).val())
            })
        });
        $.post("email.php", {
            action: 'printCalcForm',
            email: $('#email').val(),
            'result[]': result,
            'name': $("#name").val(),
            'date': $("#date").val(),
            'grandTotal': $("#total").val(),
            'hourlyRate': $("#rate").val(),
            'totalPay': $("#totalPay").val(),
            'comment': $("#comment").val()
        },
        function(xml) {
            var a = window.open();
            a.document.write(xml);
            a.document.close();
            a.print();
            a.window.close()
        })
    });
    $("#sendEmail").click(function() {
        $("#calculate").click();
        $("#emailBox").show(500)
    });
    $(".cancelSend").click(function() {
        $("#emailBox").hide(500)
    });
    $(".submitSendEmail").click(function() {
        $(this).attr("disabled", "disabled").val("Sending...");
        $("#msg").html("Sending your result, please wait.").fadeIn();
		var captcha = $("#captcha").val();

        if ($("#email").val().indexOf("@") == -1) {
            $("#msg").html("Failed, please check your email format.");
            $(this).attr("disabled", false).val("Send")
        } else if (captcha.length != 5) {
            $("#msg").html("Failed, please check your captcha.");
            $(this).attr("disabled", false).val("Send")
        }  else {
			var email = $("#email").val();
			var emails= new Array();
			emails = email.split(",");
			if(emails.length > 2){
				$("#msg").html("Max. 2 email addresses per batch.");
				$(this).attr("disabled", false).val("Send");
			}else{
				var result = [];
				$(".inputLine").each(function() {
					$("input,select", this).each(function(i) {
						result.push($(this).val())
					})
				});
				$.post("email.php", {
					action: 'submitFromCalcForm',
					email: $('#email').val(),
					'result[]': result,
					'name': $("#name").val(),
					'date': $("#date").val(),
					'grandTotal': $("#total").val(),
					'hourlyRate': $("#rate").val(),
					'totalPay': $("#totalPay").val(),
					'captcha': $("#captcha").val(),
					'calculator': $("#calculator").val(),
					'comment': $("#comment").val()
				},
				function(xml) {
					xml = parseInt(xml, 10);
					$(".submitSendEmail").attr("disabled", "").val("Send");
					if (xml) {
						$("#msg").html("Result has been sent successfully.").fadeOut(3000, 
						function() {
							$("#emailBox").hide(500);
							var Pnk = document.getElementById("captchaImg");
							Pnk.src = "http://www.calculatehours.com/24hour/Time_Calculator/calc/captcha.php?tempstr=" + Math.random();
						})
					} else {
						if(xml==0){
							$("#msg").html("Captcha error, please try again.");
							document.getElementById("captcha").value="";
							var Pnk = document.getElementById("captchaImg");
							Pnk.src = "http://www.calculatehours.com/24hour/Time_Calculator/calc/captcha.php?tempstr=" + Math.random();

						}else{
							$("#msg").html("Sent failed, please retry again.");
						}
					}
				})
			}
        }
    })
});