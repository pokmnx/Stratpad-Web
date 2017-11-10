(function (window, $, undefined) {
	$(document).ready(function () {

	});
	$(window).load(function () {

		function get_url_param(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
		}

		if($('#fname').length && !get_url_param('AUTO_PREFILL')){
			$('#fname').val(get_url_param('fname'));
			$('#lname').val(get_url_param('lname'));
			$('#email').val(get_url_param('email'));
			$('#re_email').val(get_url_param('email'));
		}

		if(get_url_param('UPGRADEPROD'))
			$('#order__cart__contents .order__box__title .order__box__aux2').text('Upgrade Your StratPad Subscription To:').css('visibility','visible');
		else
			$('#order__cart__contents .order__box__title .order__box__aux2').text('Purchase Your StratPad Subscription:').css('visibility','visible');

		$('#order__autorenewal').attr('checked','checked');
		$('#order__checkout__footer').appendTo('#sub-footer');
		$('#order__finish__footer').appendTo('#sub-footer');
		$('table.table-custom-qty.table-custom-qty-qty0 input[type="text"]')
			.val('1')
			.attr('disabled','disabled')
			.parent()
			.next()
			.remove();

		$('#order__coupon__wrapper').append('<span id="order_coupon_text">Apply the coupon</span>');

		if($('.order__finish__aftersale__msg')){
			$('.order__finish__aftersale__msg').prependTo("#__EL_DEL");
		}


	});
})(window, jQuery);
