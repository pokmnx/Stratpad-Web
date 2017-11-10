<script type="text/javascript">

// old GA code on Avangate in meta

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3611832-3']);
_gaq.push(['_setDomainName', 'stratpad.com']);
_gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

</script>


// **** start of new code; installed in Avangate - Setup -> Interface Templates -> Edit Button -> HEAD Information -> Body Information -> Javascript Code



   function rtl_fixes(){       
    if($('html').attr('dir') == "rtl"){
      $('body').attr('id','rtl');
      $('.order__billing__total').css('unicodeBidi', "embed");
      $('.coupon-checkbox-wrap').css('textAlign', 'right').css('marginRight', '17px');
      $('#order__coupon__wrapper').css('textAlign', 'right').css('marginRight', '20px');
      $('.support_container_top').css('textAlign', 'right');
      $('#order__autorenewal__label').attr('dir','rtl');      
      $('table.form-table-userinfo tr').each(function(index){
        $(this).find('td:last').css('textAlign','right');
      });
      $('.order__table__homepage__link td:first').attr('align','right');
      $('.order__table__homepage__link td:eq(1)').attr('align','left');
      if (sPage=='verify.php'){
        $('#order__billing__address, #order__delivery__address').attr('align','right');        
        $('#img_capcha').parent().next().find('a').css({'margin-left':'0px','margin-right':'30px'});
        $('#img_capcha').parent().css('text-align','right');
        $('.helpClass').parent().css({'padding-right':'20px','padding-left':'0px'});
        $('.form-table-userinfo.form-table-verify .firstTdFormLabel').css('text-align','left');              
    $('.order__ccprocess__form__review .firstTdFormLabel').css('text-align','right');  ;
        $('img.secure-lock-ico').parent().css('text-align','right');
        $('#order__3dsecure__text').parent().css('text-align','right');
      }
      if (sPage=='product.php'){
        $('a.order__homepage__link').parent().attr('align','right');
      }
      if (sPage=='cart.php'){
        $('#rtl .cross__sell__delimiter').each(function(){
          $(this).find('a:first').attr('style','float:right;margin-left:8px;margin-bottom:4px;');
          $(this).find('td').attr('align','left');
          $(this).attr('align','left');
        });        
      }
    }
  }
  
function parseQueryString(queryString) {
	var params = {}, queries, temp, i, l;

	// Split into key/value pairs
	queries = queryString.split("&");

	// Convert the array of strings into an object
	for (i = 0, l = queries.length; i < l; i++) {
		temp = queries[i].split('=');
		params[temp[0]] = temp[1];
	}

	return params;
};

(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o),
	m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

// universal analytics code on Avangate in body, for store.stratpad.com
function trackSales() {
  console.log('*****tracksales');
	ga('create', 'UA-3611832-10', 'stratpad.com');

	// production ids, see build.properties
	var productNames = {
		// production
		'4615539': "Startup",
		'4615540': "Business",
		'4615541': "Unlimited",
		'4640964': 'Connect',
		'4655370': 'Business Monthly',
		'4655369': 'Unlimited Monthly',
		'4655184': 'Coach',
		'4655366': 'Coach Monthly',
		'4655367': 'Association',
		'4655368': 'Association Monthly',

		// sandbox
		'4615217': 'Startup',
		'4615224': 'Business',
		'4615226': 'Unlimited',
		'4641549': 'Connect',
		'4655190': 'Business Monthly',
		'4655189': 'Unlimited Monthly',
		'4655185': 'Coach',
		'4655186': 'Coach Monthly',
		'4655187': 'Association',
		'4655188': 'Association Monthly'		
	};

	var params = parseQueryString(window.location.search.substr(1));

	// /order/checkout.php?PRODS=4615540
	// /order/upgrade.php?UPGRADEPROD=4615540&EXISTINGPRODUCTKEY=Free|Startup|Business|Unlimited -> redirects to checkout.php anyway

	if (/checkout.php$/.test(window.location.pathname) || /upgrade.php$/.test(window.location.pathname)) {
		var isCouponApplied = omniture_vars && omniture_vars.DISCOUNT_COUPON == 'applied';
		if (isCouponApplied) {
			// ignore this event - we have already recorded the View... eventName before the coupon was applied
			// we will also record its completion
			return;
		};
		var isUpgrade = params.hasOwnProperty('UPGRADEPROD');
		if (isUpgrade) {
			var from = params['EXISTINGPRODUCTKEY'];
			var to = params['UPGRADEPROD'];
			var eventLabel = from;
			ga('send', 'event', 'SalesFunnel', 'ViewUpgrade', eventLabel, 0);
		} else {
			var productId = params['PRODS'];
			var eventLabel = productNames[productId];
			ga('send', 'event', 'SalesFunnel', 'ViewOrder', eventLabel, 0);		
		}
	}

	else if (/finish.php$/.test(window.location.pathname)) {
		var product = myOrder.productsInOrder[0];
		var productId = product.id;
		var eventLabel = productNames[productId];
		var isUpgrade = product.purchaseType == 'UPGRADE';

		// send additional event if we used a coupon
		var hasCoupon = product.hasOwnProperty('coupon') && product.coupon.length > 0;
		if (hasCoupon) {
			var eventName = isUpgrade ? 'CouponUpgrade' : 'CouponOrder';
			var discount = Math.round(Math.abs(product.discountUSD));
			ga('send', 'event', 'SalesFunnel', eventName, eventLabel, discount);
		}
		
		var eventName = isUpgrade ? 'CompleteUpgrade' : 'CompleteOrder';
		var price = Math.abs(product.priceUSD);
		ga('send', 'event', 'SalesFunnel', eventName, eventLabel, price);			
	
	}

}

  function customProductPageFixes() {
     console.log('*****customProductPageFixes'); 
    if (/product.php$/.test(window.location.pathname)) {
      $('.order__product__buttons #DownoadButton').val('Free Trial');
      $('.order__product__buttons #AddToCart').hide();
    }
  }

  // hack to empty the cart, so we don't get multiple items (which we can't and don't want to handle)
  function emptyCart() {
  	if ( /checkout.php$/.test(window.location.pathname) && omniture_vars.CART_PRODUCTS.length > 1) {
  		// see custom_item_delete() for reference
  		// we want to find all check boxes that don't belong to the product of interest and check them, then submit the form
		var params = parseQueryString(window.location.search.substr(1));
		var productId = params['PRODS'];

  		$('#order__products input[type=checkbox]').each(function() {
  			var $this = $(this);
  			if ($this.val() != productId) {
  				$this.attr('checked', true);
  			};
  		});

  		// submit
  		var tmp = $('form[name="frmCart"]');
        if(tmp.length>0){ $(tmp).submit(); return true; }
        tmp = $('form[name="frmCheckout"]');
        if(tmp.length>0){ $(tmp).submit(); return true; }

  	};
  }

// goes with the other tries
try { rtl_fixes(); } catch(err){ try{console.log(err);}catch(err){} }
try { trackSales(); } catch(err){ try{console.log(err);}catch(err){} }    
try { customProductPageFixes(); } catch(err){ try{console.log(err);}catch(err){} }    
try { emptyCart(); } catch(err){ try{console.log(err);}catch(err){} }    

