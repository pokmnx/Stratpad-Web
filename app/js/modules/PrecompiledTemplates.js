(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['FeedbackView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"feedback-form\">\n	<nav id=\"feedback-trigger\"><span>";
  if (helper = helpers.feedbackOpen) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.feedbackOpen); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><i class=\"icon-ui-arrow-up-2\"></i></nav>\n	<div id=\"feedback-panel\">\n		<form>\n		<p>Your opinion is very important to us! I would like to:</p>\n		<ul class=\"clean-list\">\n			<li><input type=\"radio\" name=\"category\" value=\"Question\" tabindex=\"-1\">Ask a Question</li>\n			<li><input type=\"radio\" name=\"category\" value=\"Suggestion\" tabindex=\"-1\">Make a Suggestion</li>\n			<li><input type=\"radio\" name=\"category\" value=\"Bug\" tabindex=\"-1\">Report a Bug</li>\n			<li><input type=\"radio\" name=\"category\" value=\"Comment\" tabindex=\"-1\">Make a Comment</li>\n		</ul>\n\n		<p>Explain in as much detail as needed:</p>\n		<textarea id=\"feedback\" tabindex=\"-1\"></textarea>\n		<button class=\"blue-btn\" tabindex=\"-1\">Submit</button>\n		<span class=\"message\"></span>\n		</form>\n	</div>\n</div>\n";
  return buffer;
  });
templates['community/CommunityAgreementView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n	<div class=\"howItWorks\">\n	    <h4>Connect is a free service that creates high-quality matches between entrepreneurs and lenders. </h4>\n	    \n	    <div>\n	    	<strong>Here’s how it works:</strong>\n    	    <ol>\n    	        <li>Connect features a list of lenders and investors interested in funding businesses like yours.\u2028</li>\n    	        <li>Connect asks you a few questions about your business and its primary shareholder.\u2028</li>\n    	        <li>Connect compares your answers to the lenders’ criteria and shows you any matches.\u2028</li>\n    	        <li>Click on lenders you’d like to be introduced to. Connect makes the introduction and helps you complete any necessary documents.\u2028</li>\n    	        <li>The lender will contact you within 2 business days to discuss next steps.\u2028</li>\n    	        <li>Two weeks later, Connect will email you a 1-minute survey about the quality of your experience.</li>\n    	    </ol>\n	    </div>\n\n	    <div>\n	    	<strong>Everything is confidential</strong>\n    	    <ul>\n    	        <li>The information you enter in Connect is not shared with anyone except when making introductions.</li>\n    	        <li>For each introduction Connect will tell you what information will be shared and get your permission to share it.\u2028</li>\n    	        <li>Lenders agree to use this information to contact you once and for no other purpose.</li>\n    	        <li>When sharing your business plan using StratPad’s multi-user or export options the information you provide in Connect is not included.</li>\n                <li>If you would like to be featured as a lender in Connect, contact us at <a href=\"mailto:connect@stratpad.com?subject=Lenders and Investors Connect Request\">connect@stratpad.com</a> for more information.</li>\n    	    </ul>\n    	</div>\n    </div>\n\n    <div class=\"agreement\">\n	    <button id=\"understandAgreement\" class=\"blue-btn\">I understand and agree.</button>\n	    <p class=\"small-text\">\n	    	<input id=\"showAgreementAlways\" type=\"checkbox\" name=\"showAgreementAlways\" /> \n	    	Show this screen every time I visit \"Lenders and Investors\".\n	    </p>\n	</div>\n\n	<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n</div>";
  return buffer;
  });
templates['community/SearchDetailView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n				<img src=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">\n			";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				<li>";
  if (helper = helpers.city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.provinceState) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.provinceState); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.zipPostal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.zipPostal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				<li>";
  if (helper = helpers.city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.zipPostal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.zipPostal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "\n				<li>They will contact you within 2 business days.\u2028</li>\n				<li>In the meantime, print out and complete the required documents.</li>\n				";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.approved), {hash:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  return buffer;
  }
function program10(depth0,data) {
  
  
  return "\n					<li>They will contact you within 1 business day.\u2028</li>\n					";
  }

function program12(depth0,data) {
  
  
  return "\n					<li>Because this business is not yet a StratPad Connect partner, it may take up to 3 days to receive an answer.</li>\n					";
  }

function program14(depth0,data) {
  
  
  return "\n			<p>They will contact you within 2 business days.</p>\n			<p>Please click on the required documents to download, print and complete them.</p>\n			";
  }

function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.approved), {hash:{},inverse:self.program(19, program19, data),fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  return buffer;
  }
function program17(depth0,data) {
  
  
  return "\n				<li>They will contact you within 1 business day.\u2028</li>\n				";
  }

function program19(depth0,data) {
  
  
  return "\n				<li>Because this business is not yet a StratPad Connect partner, it may take up to 3 days to receive an answer.</li>\n				";
  }

function program21(depth0,data) {
  
  
  return "\n	<div class=\"documents\">\n		<strong>Required Documents</strong>\n		<ul></ul>\n	</div>\n	";
  }

  buffer += "<div>\n	<ul class=\"lenderInfo clean-list group\">\n		<li class=\"logo\">\n			<img src=\"";
  if (helper = helpers.logoUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.logoUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n\n			<div class=\"certifications\">\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.certifications), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.accreditationLogos), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "						\n			</div>\n		</li>\n		<li class=\"location\">\n			<ul>\n				<li><strong>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong></li>\n				<li>";
  if (helper = helpers.branchName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.branchName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.address1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.address2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.provinceState), {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				\n			</ul>\n		</li>\n		<li class=\"welcome\">";
  if (helper = helpers.welcomeMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.welcomeMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n	</ul>	\n\n	<div class=\"lenderIntroduction\">\n		<div class=\"part1 active\">\n			<strong>Would you like to be introduced to this organization?\u2028</strong>\n			<ol>\n				<li>By clicking the button below you agree to allow Connect to send your first name, last name and email address to this organization.\u2028</li>\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isLender), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</ol>\n		    <button id=\"introduceLender\" class=\"orange-btn\">I wish to be introduced to this organization</button>\n		    <button id=\"hideSearchDetail\" class=\"grey-btn\">Return to Search Results</button>\n		</div>\n		<div class=\"part2\">\n			<strong>Connect has sent an introductory message to this organization on your behalf.</strong>\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isLender), {hash:{},inverse:self.program(16, program16, data),fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		    <button id=\"hideSearchDetail\" class=\"grey-btn\">Return to Search Results</button>\n		</div>\n	</div>\n\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isLender), {hash:{},inverse:self.noop,fn:self.program(21, program21, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    <div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n</div>";
  return buffer;
  });
templates['community/SearchResult'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				<li>";
  if (helper = helpers.city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.provinceState) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.provinceState); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.zipPostal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.zipPostal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				<li>";
  if (helper = helpers.city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.country) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.country); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", ";
  if (helper = helpers.zipPostal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.zipPostal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "";
  buffer += "\n				<img src=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">\n			";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				<button class=\"learnMore orange-btn icon-ui-arrow-right-4\">";
  if (helper = helpers.matching_btn_intro_request_sent) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_btn_intro_request_sent); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n			";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.learnMore), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.claimServiceProvider), {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "					\n			";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n					<button class=\"learnMore blue-btn icon-ui-arrow-right-4\">";
  if (helper = helpers.matching_btn_learn_more) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_btn_learn_more); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n				";
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n					<button class=\"claimServiceProvider blue-btn icon-ui-link-2\" data-company-name=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-service-provider-id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.matching_btn_claim_service_provider) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_btn_claim_service_provider); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n				";
  return buffer;
  }

  buffer += "<li class=\"searchResult\" data-fid=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n	<ul class=\"clean-list group\">\n		<li class=\"logo\"><img src=\"";
  if (helper = helpers.logoUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.logoUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></li>\n		<li class=\"location\">\n			<ul>\n				<li><strong>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong></li>\n				<li>";
  if (helper = helpers.address1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.address2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.provinceState), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				\n			</ul>\n		</li>\n		<li class=\"description\">";
  if (helper = helpers.servicesDescription) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.servicesDescription); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n		<li class=\"certifications\">\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.certifications), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.accreditationLogos), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "			\n		</li>\n		<li class=\"actions\">\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.invitationSent), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</li>\n\n	</ul>\n\n</li>";
  return buffer;
  });
templates['community/SuggestCategoryDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header>\n	<h4>Suggest a new category for StratPad Connect</h4>\n</header>\n<article>\n	<p>If you would like to see another search category in StratPad Connect, enter that here for consideration.</p>\n\n	<form id=\"suggestCategoryForm\">\n		<input id=\"category\" type=\"text\" name=\"category\" placeholder=\"Suggest a category\" maxlength=\"32\"/>\n		<button class=\"category orange-btn\">Submit</button>\n		<div class=\"message\"></div>\n	</form>\n\n</article>";
  });
templates['community/SuggestCityDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header>\n	<h4>Suggest a new city for StratPad</h4>\n</header>\n<article>\n	<p>Generally, you want to choose the municipality with which you would register your business.</p>\n\n	<p>Before suggesting a new city, make sure you type at least a few letters of your city name. The list will narrow down as you type more letters. Then scroll to select your city.</p>\n\n	<p>If you still can't find your city, enter it here, along with your <strong>province/state/region</strong> and <strong>country</strong>. We will get back to you shortly. In the meantime, just use a nearby city.</p>\n\n	<form id=\"suggestCityForm\">\n		<input id=\"city\" type=\"text\" name=\"city\" placeholder=\"City, province/state/region and country\" maxlength=\"128\"/>\n		<button class=\"city orange-btn\">Submit</button>\n		<div class=\"message\"></div>\n	</form>\n\n</article>";
  });
templates['community/lendersAndInvestors/BusinessBackgroundView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.li_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.li_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.li_bb_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.li_bb_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"businessBackground\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/lenders-investors/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\"><strong>Learning about your business</strong> is an important first step for lenders and investors. <br>Please complete as many questions as you can and click <a id=\"next\" class=\"next-prev icon-ui-arrow-right-3\" title=\"Next Page\"></a> below.</div>\n\n		<form class=\"formPanel\">\n            <ul class=\"clean-list group\">\n                <li>\n                    <label for=\"industry\">";
  if (helper = helpers.bb_label_industry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_industry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"industry\" tabindex=\"1\" name=\"industry\" placeholder=\"";
  if (helper = helpers.bb_plhr_industry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_industry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" autofocus></select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"profitable\">";
  if (helper = helpers.bb_label_profitable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_profitable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"profitable\" tabindex=\"2\" name=\"profitable\" placeholder=\"";
  if (helper = helpers.bb_plhr_profitable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_profitable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.bb_plhr_profitable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_profitable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"true\">Yes</option>\n                        <option value=\"false\">No</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"duns\">";
  if (helper = helpers.bb_label_duns) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_duns); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"duns\" tabindex=\"3\" type=\"text\" name=\"duns\" placeholder=\"";
  if (helper = helpers.bb_plhr_duns) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_duns); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" maxlength=\"20\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"businessTaxId\">";
  if (helper = helpers.bb_label_businessTaxId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_businessTaxId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"businessTaxId\" tabindex=\"4\" type=\"text\" name=\"businessTaxId\" placeholder=\"";
  if (helper = helpers.bb_plhr_businessTaxId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_businessTaxId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" maxlength=\"20\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"moneyRequired\">";
  if (helper = helpers.bb_label_moneyRequired) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_moneyRequired); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"moneyRequired\" tabindex=\"5\" name=\"moneyRequired\" placeholder=\"";
  if (helper = helpers.bb_plhr_moneyRequired) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_moneyRequired); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.bb_plhr_moneyRequired) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_moneyRequired); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"0-25000\">0-25,000</option>\n                        <option value=\"25000-50000\">25,000-50,000</option>\n                        <option value=\"50000-100000\">50,000-100,000</option>\n                        <option value=\"100000-250000\">100,000-250,000</option>\n                        <option value=\"250000-500000\">250,000-500,000</option>\n                        <option value=\"500000-750000\">500,000-750,000</option>\n                        <option value=\"750000-1000000\">750,000-1,000,000</option>\n                        <option value=\"1000000-\">More than 1,000,000</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"yearsInBusiness\">";
  if (helper = helpers.bb_label_yearsInBusiness) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_yearsInBusiness); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"yearsInBusiness\" tabindex=\"6\" type=\"text\" name=\"yearsInBusiness\" placeholder=\"";
  if (helper = helpers.bb_plhr_yearsInBusiness) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_yearsInBusiness); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"requestedAssetTypes\">";
  if (helper = helpers.bb_label_requestedAssetTypes) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_requestedAssetTypes); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"requestedAssetTypes\" tabindex=\"7\" name=\"requestedAssetTypes\" placeholder=\"";
  if (helper = helpers.bb_plhr_requestedAssetTypes) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_requestedAssetTypes); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >\n                      <option value=\"\">";
  if (helper = helpers.bb_plhr_requestedAssetTypes) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_requestedAssetTypes); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                      <option value=\"Land\">Land</option>\n                      <option value=\"Building\">Building</option>\n                      <option value=\"Machinery\">Machinery</option>\n                      <option value=\"Furniture\">Furniture</option>\n                      <option value=\"Tools\">Tools</option>\n                      <option value=\"IT Equipment\">IT Equipment</option>\n                      <option value=\"Vehicles\">Vehicles</option>\n                      <option value=\"Other\">Other</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>                \n                <li>\n                    <label for=\"businessStructure\">";
  if (helper = helpers.bb_label_businessStructure) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_businessStructure); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"businessStructure\" tabindex=\"8\" name=\"businessStructure\" placeholder=\"";
  if (helper = helpers.bb_plhr_businessStructure) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_businessStructure); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >\n                        <option value=\"\">";
  if (helper = helpers.bb_plhr_businessStructure) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_businessStructure); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"Sole Proprietorship\">Sole Proprietorship</option>\n                        <option value=\"General Partnership\">General Partnership</option>\n                        <option value=\"Limited Partnership\">Limited Partnership</option>\n                        <option value=\"Limited Liability Partnership (LLP)\">Limited Liability Partnership (LLP)</option>\n                        <option value=\"Limited Liability Limited Partnership (LLLP)\">Limited Liability Limited Partnership (LLLP)</option>\n                        <option value=\"Corporation\">Corporation</option>\n                        <option value=\"Nonprofit Corporation\">Nonprofit Corporation</option>\n                        <option value=\"Limited Liability Company (LLC)\">Limited Liability Company (LLC)</option>\n                        <option value=\"Massachusetts Trust\">Massachusetts Trust</option>\n                        <option value=\"Trust\">Trust</option>\n                        <option value=\"Joint Venture\">Joint Venture</option>\n                        <option value=\"Tenants in Common\">Tenants in Common</option>\n                        <option value=\"Municipality\">Municipality</option>\n                        <option value=\"Association\">Association</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"financingTypeRequested\">";
  if (helper = helpers.bb_label_financingTypeRequested) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_financingTypeRequested); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"financingTypeRequested\" tabindex=\"9\" name=\"financingTypeRequested\" placeholder=\"";
  if (helper = helpers.bb_plhr_financingTypeRequested) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_financingTypeRequested); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >\n                        <option value=\"\">";
  if (helper = helpers.bb_plhr_financingTypeRequested) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_financingTypeRequested); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"Loan\">Loan</option>\n                        <option value=\"Investment\">Investment</option>\n                        <option value=\"Other\">Other</option>                        \n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"revenue\">";
  if (helper = helpers.bb_label_revenue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_revenue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"revenue\" tabindex=\"10\" name=\"revenue\" placeholder=\"";
  if (helper = helpers.bb_plhr_revenue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_revenue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.bb_plhr_revenue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_revenue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"0-250000\">0-250,000</option>\n                        <option value=\"250000-500000\">250,000-500,000</option>\n                        <option value=\"500000-750000\">500,000-750,000</option>\n                        <option value=\"750000-1000000\">750,000-1,000,000</option>\n                        <option value=\"1000000-2000000\">1,000,000-200,000</option>\n                        <option value=\"2000000-5000000\">2,000,000-5,000,000</option>\n                        <option value=\"5000000-10000000\">5,000,000-10,000,000</option>\n                        <option value=\"10000000-\">More than 10,000,000</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"zipOrPostalCode\">";
  if (helper = helpers.bb_label_zipOrPostalCode) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_zipOrPostalCode); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"zipOrPostalCode\" tabindex=\"11\" type=\"text\" name=\"zipOrPostalCode\" placeholder=\"";
  if (helper = helpers.bb_plhr_zipOrPostalCode) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_zipOrPostalCode); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" maxlength=\"10\"/>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>                \n\n                <!-- ISO 639-2\n                <li>\n                    <label for=\"preferredLanguage\">";
  if (helper = helpers.bb_label_preferredLanguage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_preferredLanguage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"preferredLanguage\" tabindex=\"12\" name=\"preferredLanguage\" placeholder=\"";
  if (helper = helpers.bb_plhr_preferredLanguage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_preferredLanguage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" >\n                        <option value=\"\">";
  if (helper = helpers.bb_plhr_preferredLanguage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_plhr_preferredLanguage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"aa\">Afar</option>\n                        <option value=\"ab\">Abkhazian</option>\n                        <option value=\"af\">Afrikaans</option>\n                        <option value=\"ak\">Akan</option>\n                        <option value=\"sq\">Albanian</option>\n                        <option value=\"am\">Amharic</option>\n                        <option value=\"ar\">Arabic</option>\n                        <option value=\"an\">Aragonese</option>\n                        <option value=\"hy\">Armenian</option>\n                        <option value=\"as\">Assamese</option>\n                        <option value=\"av\">Avaric</option>\n                        <option value=\"ae\">Avestan</option>\n                        <option value=\"ay\">Aymara</option>\n                        <option value=\"az\">Azerbaijani</option>\n                        <option value=\"ba\">Bashkir</option>\n                        <option value=\"bm\">Bambara</option>\n                        <option value=\"eu\">Basque</option>\n                        <option value=\"be\">Belarusian</option>\n                        <option value=\"bn\">Bengali</option>\n                        <option value=\"bh\">Bihari languages</option>\n                        <option value=\"bi\">Bislama</option>\n                        <option value=\"bo\">Tibetan</option>\n                        <option value=\"bs\">Bosnian</option>\n                        <option value=\"br\">Breton</option>\n                        <option value=\"bg\">Bulgarian</option>\n                        <option value=\"my\">Burmese</option>\n                        <option value=\"ca\">Catalan; Valencian</option>\n                        <option value=\"cs\">Czech</option>\n                        <option value=\"ch\">Chamorro</option>\n                        <option value=\"ce\">Chechen</option>\n                        <option value=\"zh\">Chinese</option>\n                        <option value=\"cu\">Church Slavic</option>\n                        <option value=\"cv\">Chuvash</option>\n                        <option value=\"kw\">Cornish</option>\n                        <option value=\"co\">Corsican</option>\n                        <option value=\"cr\">Cree</option>\n                        <option value=\"cy\">Welsh</option>\n                        <option value=\"cs\">Czech</option>\n                        <option value=\"da\">Danish</option>\n                        <option value=\"de\">German</option>\n                        <option value=\"dv\">Divehi; Dhivehi; Maldivian</option>\n                        <option value=\"nl\">Dutch; Flemish</option>\n                        <option value=\"dz\">Dzongkha</option>\n                        <option value=\"el\">Greek, Modern (1453-)</option>\n                        <option value=\"en\">English</option>\n                        <option value=\"eo\">Esperanto</option>\n                        <option value=\"et\">Estonian</option>\n                        <option value=\"eu\">Basque</option>\n                        <option value=\"ee\">Ewe</option>\n                        <option value=\"fo\">Faroese</option>\n                        <option value=\"fa\">Persian</option>\n                        <option value=\"fj\">Fijian</option>\n                        <option value=\"fi\">Finnish</option>\n                        <option value=\"fr\">French</option>\n                        <option value=\"fr\">French</option>\n                        <option value=\"fy\">Western Frisian</option>\n                        <option value=\"ff\">Fulah</option>\n                        <option value=\"ka\">Georgian</option>\n                        <option value=\"de\">German</option>\n                        <option value=\"gd\">Gaelic; Scottish Gaelic</option>\n                        <option value=\"ga\">Irish</option>\n                        <option value=\"gl\">Galician</option>\n                        <option value=\"gv\">Manx</option>\n                        <option value=\"el\">Greek, Modern (1453-)</option>\n                        <option value=\"gn\">Guarani</option>\n                        <option value=\"gu\">Gujarati</option>\n                        <option value=\"ht\">Haitian; Haitian Creole</option>\n                        <option value=\"ha\">Hausa</option>\n                        <option value=\"he\">Hebrew</option>\n                        <option value=\"hz\">Herero</option>\n                        <option value=\"hi\">Hindi</option>\n                        <option value=\"ho\">Hiri Motu</option>\n                        <option value=\"hr\">Croatian</option>\n                        <option value=\"hu\">Hungarian</option>\n                        <option value=\"hy\">Armenian</option>\n                        <option value=\"ig\">Igbo</option>\n                        <option value=\"is\">Icelandic</option>\n                        <option value=\"io\">Ido</option>\n                        <option value=\"ii\">Sichuan Yi; Nuosu</option>\n                        <option value=\"iu\">Inuktitut</option>\n                        <option value=\"ie\">Interlingue; Occidental</option>\n                        <option value=\"ia\">Interlingua</option>\n                        <option value=\"id\">Indonesian</option>\n                        <option value=\"ik\">Inupiaq</option>\n                        <option value=\"is\">Icelandic</option>\n                        <option value=\"it\">Italian</option>\n                        <option value=\"jv\">Javanese</option>\n                        <option value=\"ja\">Japanese</option>\n                        <option value=\"kl\">Kalaallisut; Greenlandic</option>\n                        <option value=\"kn\">Kannada</option>\n                        <option value=\"ks\">Kashmiri</option>\n                        <option value=\"ka\">Georgian</option>\n                        <option value=\"kr\">Kanuri</option>\n                        <option value=\"kk\">Kazakh</option>\n                        <option value=\"km\">Central Khmer</option>\n                        <option value=\"ki\">Kikuyu; Gikuyu</option>\n                        <option value=\"rw\">Kinyarwanda</option>\n                        <option value=\"ky\">Kirghiz; Kyrgyz</option>\n                        <option value=\"kv\">Komi</option>\n                        <option value=\"kg\">Kongo</option>\n                        <option value=\"ko\">Korean</option>\n                        <option value=\"kj\">Kuanyama; Kwanyama</option>\n                        <option value=\"ku\">Kurdish</option>\n                        <option value=\"lo\">Lao</option>\n                        <option value=\"la\">Latin</option>\n                        <option value=\"lv\">Latvian</option>\n                        <option value=\"li\">Limburgan; Limburger; Limburgish</option>\n                        <option value=\"ln\">Lingala</option>\n                        <option value=\"lt\">Lithuanian</option>\n                        <option value=\"lb\">Luxembourgish; Letzeburgesch</option>\n                        <option value=\"lu\">Luba-Katanga</option>\n                        <option value=\"lg\">Ganda</option>\n                        <option value=\"mk\">Macedonian</option>\n                        <option value=\"mh\">Marshallese</option>\n                        <option value=\"ml\">Malayalam</option>\n                        <option value=\"mi\">Maori</option>\n                        <option value=\"mr\">Marathi</option>\n                        <option value=\"ms\">Malay</option>\n                        <option value=\"mk\">Macedonian</option>\n                        <option value=\"mg\">Malagasy</option>\n                        <option value=\"mt\">Maltese</option>\n                        <option value=\"mn\">Mongolian</option>\n                        <option value=\"mi\">Maori</option>\n                        <option value=\"ms\">Malay</option>\n                        <option value=\"my\">Burmese</option>\n                        <option value=\"na\">Nauru</option>\n                        <option value=\"nv\">Navajo; Navaho</option>\n                        <option value=\"nr\">Ndebele, South; South Ndebele</option>\n                        <option value=\"nd\">Ndebele, North; North Ndebele</option>\n                        <option value=\"ng\">Ndonga</option>\n                        <option value=\"ne\">Nepali</option>\n                        <option value=\"nl\">Dutch; Flemish</option>\n                        <option value=\"nn\">Norwegian Nynorsk; Nynorsk, Norwegian</option>\n                        <option value=\"nb\">Bokmål, Norwegian; Norwegian Bokmål</option>\n                        <option value=\"no\">Norwegian</option>\n                        <option value=\"ny\">Chichewa; Chewa; Nyanja</option>\n                        <option value=\"oc\">Occitan (post 1500)</option>\n                        <option value=\"oj\">Ojibwa</option>\n                        <option value=\"or\">Oriya</option>\n                        <option value=\"om\">Oromo</option>\n                        <option value=\"os\">Ossetian; Ossetic</option>\n                        <option value=\"pa\">Panjabi; Punjabi</option>\n                        <option value=\"fa\">Persian</option>\n                        <option value=\"pi\">Pali</option>\n                        <option value=\"pl\">Polish</option>\n                        <option value=\"pt\">Portuguese</option>\n                        <option value=\"ps\">Pushto; Pashto</option>\n                        <option value=\"qu\">Quechua</option>\n                        <option value=\"rm\">Romansh</option>\n                        <option value=\"ro\">Romanian; Moldavian; Moldovan</option>\n                        <option value=\"rn\">Rundi</option>\n                        <option value=\"ru\">Russian</option>\n                        <option value=\"sg\">Sango</option>\n                        <option value=\"sa\">Sanskrit</option>\n                        <option value=\"si\">Sinhala; Sinhalese</option>\n                        <option value=\"sk\">Slovak</option>\n                        <option value=\"sk\">Slovak</option>\n                        <option value=\"sl\">Slovenian</option>\n                        <option value=\"se\">Northern Sami</option>\n                        <option value=\"sm\">Samoan</option>\n                        <option value=\"sn\">Shona</option>\n                        <option value=\"sd\">Sindhi</option>\n                        <option value=\"so\">Somali</option>\n                        <option value=\"st\">Sotho, Southern</option>\n                        <option value=\"es\">Spanish; Castilian</option>\n                        <option value=\"sq\">Albanian</option>\n                        <option value=\"sc\">Sardinian</option>\n                        <option value=\"sr\">Serbian</option>\n                        <option value=\"ss\">Swati</option>\n                        <option value=\"su\">Sundanese</option>\n                        <option value=\"sw\">Swahili</option>\n                        <option value=\"sv\">Swedish</option>\n                        <option value=\"ty\">Tahitian</option>\n                        <option value=\"ta\">Tamil</option>\n                        <option value=\"tt\">Tatar</option>\n                        <option value=\"te\">Telugu</option>\n                        <option value=\"tg\">Tajik</option>\n                        <option value=\"tl\">Tagalog</option>\n                        <option value=\"th\">Thai</option>\n                        <option value=\"bo\">Tibetan</option>\n                        <option value=\"ti\">Tigrinya</option>\n                        <option value=\"to\">Tonga (Tonga Islands)</option>\n                        <option value=\"tn\">Tswana</option>\n                        <option value=\"ts\">Tsonga</option>\n                        <option value=\"tk\">Turkmen</option>\n                        <option value=\"tr\">Turkish</option>\n                        <option value=\"tw\">Twi</option>\n                        <option value=\"ug\">Uighur; Uyghur</option>\n                        <option value=\"uk\">Ukrainian</option>\n                        <option value=\"ur\">Urdu</option>\n                        <option value=\"uz\">Uzbek</option>\n                        <option value=\"ve\">Venda</option>\n                        <option value=\"vi\">Vietnamese</option>\n                        <option value=\"vo\">Volapük</option>\n                        <option value=\"cy\">Welsh</option>\n                        <option value=\"wa\">Walloon</option>\n                        <option value=\"wo\">Wolof</option>\n                        <option value=\"xh\">Xhosa</option>\n                        <option value=\"yi\">Yiddish</option>\n                        <option value=\"yo\">Yoruba</option>\n                        <option value=\"za\">Zhuang; Chuang</option>\n                        <option value=\"zh\">Chinese</option>\n                        <option value=\"zu\">Zulu <option value=\"\"></option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li> -->               \n                <li>\n                    <button class=\"continue orange-btn\">Continue<i class=\"icon-ui-arrow-right-3\"></i></button>\n                    <div>No information will be shared by going to the next page.</div>\n                </li>\n            </ul>\n\n        </form>\n\n        <div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>\n\n\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['community/lendersAndInvestors/CommunityRequirementsDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"communityRequirementsDialog\" class=\"vex vex-theme-plain\">\n	<div class=\"vex-overlay\"></div>\n	<div class=\"vex-content\">\n		<h3><emphasis>Connect</emphasis> supports your business by introducing you to appropriate lenders.</h3>\n		<p>In order to make the best introductions possible, your business plan needs:</p>\n		<ul class=\"clean-list\">\n			<li id=\"discussionCheck\">At least 140 characters in each Discussion page</li>\n			<li id=\"projectCheck\">At least 1 customized Project</li>\n			<li id=\"salesCheck\">At least 12 months of Sales and Expenses</li>\n		</ul>\n		<p>\n			<strong>Come back</strong> when you've added a bit more information to your plan!\n		</p>\n	</div>\n</div>";
  });
templates['community/lendersAndInvestors/ConnectRequestDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<h4>Can I be included on this list of search results?</h4>\n</header>\n<article>\n	<p>If you provide ";
  if (helper = helpers.service) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.service); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", and would like to have your company included on this list, please contact <a href=\"mailto:connect@stratpad.com?subject=Lenders and Investors Connect Request\">connect@stratpad.com</a></p>\n\n</article>";
  return buffer;
  });
templates['community/lendersAndInvestors/MatchingLendersAndInvestorsView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.li_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.li_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.bank_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bank_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingLendersAndInvestors\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/lenders-investors/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/lendersAndInvestors/PersonalCreditHistoryView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.li_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.li_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.li_pch_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.li_pch_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"personalCreditHistory\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/lenders-investors/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">Understanding the personal credit history of the <strong>primary shareholder</strong> is also an important step for lenders and investors. <br>Please complete as many questions as you can and click <a id=\"next\" class=\"next-prev icon-ui-arrow-right-3\" title=\"Next Page\"></a> below.</div>\n\n		<form class=\"formPanel\">\n            <ul class=\"clean-list group\">\n                <li>\n                    <label for=\"birthdate\">";
  if (helper = helpers.pch_label_birthdate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_birthdate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"birthdate\" tabindex=\"1\" type=\"text\" name=\"birthdate\" placeholder=\"";
  if (helper = helpers.pch_plhr_birthdate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_birthdate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"bankrupt\">";
  if (helper = helpers.pch_label_bankrupt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_bankrupt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"bankrupt\" tabindex=\"2\" name=\"bankrupt\" placeholder=\"";
  if (helper = helpers.pch_plhr_bankrupt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_bankrupt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.pch_plhr_bankrupt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_bankrupt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"true\">Yes</option>\n                        <option value=\"false\">No</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"gender\">";
  if (helper = helpers.pch_label_gender) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_gender); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"gender\" tabindex=\"3\" name=\"gender\" placeholder=\"";
  if (helper = helpers.pch_plhr_gender) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_gender); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.pch_plhr_gender) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_gender); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"MALE\">Male</option>\n                        <option value=\"FEMALE\">Female</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"criminalRecord\">";
  if (helper = helpers.pch_label_criminalRecord) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_criminalRecord); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"criminalRecord\" tabindex=\"4\" name=\"criminalRecord\" placeholder=\"";
  if (helper = helpers.pch_plhr_criminalRecord) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_criminalRecord); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.pch_plhr_criminalRecord) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_criminalRecord); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"true\">Yes</option>\n                        <option value=\"false\">No</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"ssnSin\">";
  if (helper = helpers.pch_label_ssnSin) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_ssnSin); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"ssnSin\" tabindex=\"5\" type=\"text\" name=\"ssnSin\" placeholder=\"";
  if (helper = helpers.pch_plhr_ssnSin) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_ssnSin); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"veteran\">";
  if (helper = helpers.pch_label_veteran) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_veteran); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <select id=\"veteran\" tabindex=\"6\" name=\"veteran\" placeholder=\"";
  if (helper = helpers.pch_plhr_veteran) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_veteran); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.pch_plhr_veteran) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_veteran); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"true\">Yes</option>\n                        <option value=\"false\">No</option>\n                    </select>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>                \n                <li>\n                    <label for=\"fico\">";
  if (helper = helpers.pch_label_fico) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_fico); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"fico\" tabindex=\"7\" type=\"text\" name=\"fico\" placeholder=\"";
  if (helper = helpers.pch_plhr_fico) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_plhr_fico); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <button class=\"continue orange-btn\">Continue<i class=\"icon-ui-arrow-right-3\"></i></button>\n                    <div>No information will be shared by going to the next page.</div>\n                </li>\n            </ul>\n		</form>\n\n        <div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['community/matching/AccountantsView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.accountant_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.accountant_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingAccountants\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/BookkeepersView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.bookkeeper_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bookkeeper_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingBookkeepers\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/CoachesView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.coachormentor_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.coachormentor_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>		\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingCoaches\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/ConnectLinkDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div>\n<header>\n	<h4>Get found by local small businesses!</h4>\n</header>\n<article>\n	<p>Can I be included on this list of search results?</p>\n	<p>If you provide ";
  if (helper = helpers.service) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.service); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", and would like to have your company included on this list, \n		<a href=\"#\">please click here and sign up to StratPad Connect</a>.</p>\n</article>\n</div>";
  return buffer;
  });
templates['community/matching/ConsultantsView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.consultant_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.consultant_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingConsultants\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/GraphicDesignersView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.graphicdesigner_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.graphicdesigner_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>		\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingGraphicDesigners\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/LawyersView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.lawyer_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lawyer_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>				\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingLawyers\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/MarketingFirmsView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.marketingfirm_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.marketingfirm_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>		\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingMarketingFirms\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/ReferFriendDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<h4>";
  if (helper = helpers.referAFriendTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.referAFriendTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n	<p>Tell ";
  if (helper = helpers.serviceProviderCategoryLongLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.serviceProviderCategoryLongLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " about Connect and get $5 when they join.</p>\n\n	<form id=\"referAFriendForm\">\n		<input id=\"referalEmail\" type=\"text\" name=\"referalEmail\" placeholder=\"Add ";
  if (helper = helpers.serviceProviderCategoryLongLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.serviceProviderCategoryLongLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'s email address\" maxlength=\"32\"/>\n		<button class=\"orange-btn\">Send</button>\n		<div class=\"message\"></div>\n	</form>\n	<br class=\"clear\">\n	<p class=\"small\">The first person to suggest this ";
  if (helper = helpers.serviceProviderCategoryLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.serviceProviderCategoryLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " is eligible for the referral fee. Referral fees are sent monthly to your PayPal account.</p>\n\n</article>";
  return buffer;
  });
templates['community/matching/SoftwareView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.software_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.software_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>		\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingSoftware\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/matching/WebDesignersView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.community_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.webdesigner_matching_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.webdesigner_matching_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>		\n	</hgroup>\n</header>\n<section>\n	<article id=\"matchingWebDesigners\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/service-providers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">";
  if (helper = helpers.matching_instructions_wait) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.matching_instructions_wait); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n\n		<div class=\"searchResults\">\n            <ul class=\"clean-list group\">\n\n            </ul>\n		</div>\n\n		<div class=\"security\"><i class=\"icon-new-lock\"></i><span>";
  if (helper = helpers.community_security) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.community_security); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></div>\n\n        <div class=\"readOnlyPlan noAccess\"></div>		\n\n	</article>\n</section>";
  return buffer;
  });
templates['community/myAccount/CompanyInfoAndBudgetView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.companyInfo_subtitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.companyInfo_subtitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"companyInfoAndBudget\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/my-connect-account/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">Tell us a little bit about your company, and how you would like to allocate your budget.</div>\n\n		<form class=\"formPanel\">\n            <ul class=\"clean-list group\">\n                <li>\n                    <label for=\"name\">";
  if (helper = helpers.ci_label_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"name\" tabindex=\"1\" type=\"text\" name=\"name\" placeholder=\"";
  if (helper = helpers.ci_plhr_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_plhr_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" autofocus />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"priceForInvitation\">";
  if (helper = helpers.ci_label_priceForInvitation) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_priceForInvitation); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"priceForInvitation\" tabindex=\"2\" type=\"text\" name=\"priceForInvitation\" placeholder=\"";
  if (helper = helpers.ci_plhr_priceForInvitation) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_plhr_priceForInvitation); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"servicesDescription\">";
  if (helper = helpers.ci_label_servicesDescription) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_servicesDescription); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"servicesDescription\" tabindex=\"3\" type=\"text\" name=\"servicesDescription\" placeholder=\"";
  if (helper = helpers.ci_plhr_servicesDescription) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_plhr_servicesDescription); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" maxlength=\"140\"/>                    \n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"monthlyAdBudget\">";
  if (helper = helpers.ci_label_monthlyAdBudget) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_monthlyAdBudget); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"monthlyAdBudget\" tabindex=\"4\" type=\"text\" name=\"monthlyAdBudget\" placeholder=\"";
  if (helper = helpers.ci_plhr_monthlyAdBudget) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_plhr_monthlyAdBudget); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li class=\"tall\">\n                    <label for=\"companyLogo\">";
  if (helper = helpers.ci_label_companyLogo) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_companyLogo); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"companyLogo\" type=\"file\" name=\"companyLogo\" tabindex=\"5\"/>\n                    <div class=\"companyLogo\"><i class=\"icon-ui-pencil\"></i></div>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li class=\"tall\">\n                    <label for=\"categories\">";
  if (helper = helpers.ci_label_categories) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_categories); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " <a id=\"suggestCategoryLink\" href=\"\" class=\"small\">";
  if (helper = helpers.ci_link_suggest_category) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_link_suggest_category); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a></label>\n                    <select id=\"categories\" tabindex=\"6\" name=\"categories\" placeholder=\"";
  if (helper = helpers.ci_plhr_categories) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_plhr_categories); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                        <option value=\"\">";
  if (helper = helpers.ci_plhr_categories) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_plhr_categories); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_mentors) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_mentors); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_mentors) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_mentors); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_accountants) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_accountants); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_accountants) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_accountants); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_bookkeepers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_bookkeepers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_bookkeepers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_bookkeepers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_consultants) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_consultants); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_consultants) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_consultants); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_lawyers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_lawyers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_lawyers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_lawyers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_coaches) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_coaches); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_coaches) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_coaches); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_marketing_firms) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_marketing_firms); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_marketing_firms) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_marketing_firms); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_web_designers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_web_designers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_web_designers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_web_designers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_graphic_designers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_graphic_designers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_graphic_designers) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_graphic_designers); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                        <option value=\"";
  if (helper = helpers.ci_value_software) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_value_software); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.ci_option_software) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_option_software); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n                    </select>                    \n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>   \n                <li>\n                    <label for=\"welcomeMessage\">";
  if (helper = helpers.ci_label_welcomeMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_welcomeMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <textarea id=\"welcomeMessage\" name=\"welcomeMessage\" tabindex=\"7\" placeholder=\"";
  if (helper = helpers.ci_plhr_welcomeMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_plhr_welcomeMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></textarea>                 \n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li class=\"tall\">\n                    <label for=\"accreditationLogos\">";
  if (helper = helpers.ci_label_accreditationLogos) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_accreditationLogos); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</label>\n                    <input id=\"accreditationLogos\" type=\"file\" name=\"accreditationLogos\" tabindex=\"8\" multiple/>\n                    <div class=\"accreditationLogos\"><i class=\"icon-ui-pencil\"></i></div>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li class=\"continue\">\n                    <button class=\"continue orange-btn\">Continue<i class=\"icon-ui-arrow-right-3\"></i></button>\n                    <div>Check your Connect Account Progress (top right) for signup feedback.</div>\n                </li>\n\n            </ul>\n\n        </form>        \n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['community/myAccount/HowItWorksView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n  <hgroup>\n    <h1>";
  if (helper = helpers.how_connect_works_heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.how_connect_works_heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <h2>";
  if (helper = helpers.howItWorks_subtitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.howItWorks_subtitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n  </hgroup>\n</header>\n<section>\n  <article id=\"howItWorks\">\n    <div class=\"stratFileHelp\">\n      <iframe src=\"\" data-url=\"help/community/my-connect-account/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\"></iframe>\n    </div>\n    <strong>What is Connect?</strong>\n    <p>Connect introduces you to local small business owners when they are searching for your services.</p>\n    <p>In each category:</p>\n    <ul>\n      <li>Connect displays a prioritized list of vendors to the small business owner.</li>\n      <li>The business owner can click on your short profile to learn more about you.</li>\n      <li>The business owner then requests an electronic introduction to you. Connect emails you the business owner's name and email address.</li>\n    </ul>\n    <strong>Connect for Lenders</strong>\n    <p>Lenders use Connect to find small businesses who are \n    <strong>prepared</strong> and who meet their \n    <strong>criteria</strong>. This saves considerable staff time and shortens the approval process.</p>\n    <ul>\n      <li>StratPad prepares the small business by helping them prepare a proper business plan including detailed cash flow statements.</li>\n      <li>Lenders tell Connect their target market criteria. Only businesses who meet these criteria AND who have a proper business plan are introduced to the lender.</li>\n      <li>Optionally, lenders may share their application forms with the small business owner thus ensuring a very productive first meeting.</li>\n    </ul>\n    <p>If you would like to be <strong>featured as a lender</strong> in Connect, contact us at <a href=\"mailto:connect@stratpad.com?subject=Lenders and Investors Connect Request\">connect@stratpad.com</a> for more information.</p>    \n    <strong>Connect for Products and Services</strong>\n    <p>Small business owners need key products and services to run their business and be successful. Connect introduces them directly to high-quality, local people who can help them.</p>\n    <p>Do you want to be introduced to small business owners? <a id=\"goConnect\" href=\"#\">Just click here</a>.</p>\n  </article>\n</section>\n";
  return buffer;
  });
templates['community/myAccount/LocationView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.location_subtitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_subtitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"location\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/my-connect-account/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div class=\"instructions\">Tell us about the location of your company, so that we can match you with nearby prospective clients.<br>Please complete the following fields.</div>\n\n		<form class=\"formPanel\" autocomplete=\"off\">\n            <ul class=\"clean-list group\">\n                <li>\n                    <label for=\"address1\">";
  if (helper = helpers.location_label_address) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_address); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"address1\" tabindex=\"1\" type=\"text\" name=\"address1\" placeholder=\"";
  if (helper = helpers.location_plhr_address) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_plhr_address); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" autocomplete=\"off\" autofocus />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"location\">";
  if (helper = helpers.location_label_location) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_location); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " <a id=\"suggestCity\" href=\"\" class=\"small\">";
  if (helper = helpers.location_link_suggest_city) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_link_suggest_city); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a></label>\n                    <select class=\"location\" id=\"location\" tabindex=\"2\" type=\"text\" name=\"location\" placeholder=\"";
  if (helper = helpers.location_plhr_location) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_plhr_location); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" autocomplete=\"off\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                    <label for=\"zipPostal\">";
  if (helper = helpers.location_label_zipPostal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_zipPostal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <input id=\"zipPostal\" tabindex=\"3\" type=\"text\" name=\"zipPostal\" placeholder=\"";
  if (helper = helpers.location_plhr_zipPostal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_plhr_zipPostal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" maxlength=\"10\" autocomplete=\"off\" />\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n                <li>\n                      <label>";
  if (helper = helpers.location_label_terms) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_terms); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                      <div class=\"termsWrapper\">\n                          <input id=\"termsAccepted\" tabindex=\"4\" type=\"checkbox\" name=\"termsAccepted\" />\n                          <label for=\"termsAccepted\">I agree to the <a href=\"#\">Terms and Conditions</a></label>\n                      </div>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n\n                <li>\n                    <label for=\"payment\">";
  if (helper = helpers.location_label_payment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_payment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                    <button id=\"payment\" class=\"orange-btn\" disabled>";
  if (helper = helpers.btnMakePayment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnMakePayment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<i class=\"icon-ui-credit\"></i></button>\n                    <span class=\"icon-ui-question important-info\"></span>\n                </li>\n            </ul>\n\n        </form>        \n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['community/myAccount/PaymentDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"paymentDialog\">\n  <span class=\"instructions\">Credit/debit card only</span>\n  <ul id=\"paymentFields\" class=\"group s1_formPanel dialogFields\">\n    <li class=\"ocLabel\">Name (Billing)</li>\n    <li class=\"billingInputs\">\n      <input name=\"firstName\" type=\"text\" id=\"firstName\" placeholder=\"";
  if (helper = helpers.plhrHolderFirstName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrHolderFirstName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"21\" autocomplete=\"off\" required/>\n      <input name=\"lastName\" type=\"text\" id=\"lastName\" placeholder=\"";
  if (helper = helpers.plhrHolderLastName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrHolderLastName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"22\" autocomplete=\"off\" required/>\n    </li>\n    <li class=\"ocLabel\">Email (Billing)</li>\n    <li>\n      <input name=\"email\" type=\"text\" id=\"email\" placeholder=\"";
  if (helper = helpers.plhrHolderEmail) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrHolderEmail); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"23\" autocomplete=\"off\" required/>\n    </li>\n    <li class=\"ocLabel billing\">Cardholder Name</li>\n    <li class=\"billing\">\n      <input name=\"holderName\" type=\"text\" id=\"holderName\" placeholder=\"";
  if (helper = helpers.plhrHolderName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrHolderName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"24\" autocomplete=\"off\" required/>\n    </li>    \n    <li class=\"ocLabel\">Card Type</li>\n    <li>\n      <select name=\"cardType\" id=\"cardType\" tabindex=\"25\">\n        <option value=\"VISA\">VISA</option>\n        <option value=\"VISAELECTRON\">VISAELECTRON</option>\n        <option value=\"MASTERCARD\">MASTERCARD</option>\n        <option value=\"MAESTRO\">MAESTRO</option>\n        <option value=\"AMEX\">AMEX</option>\n        <option value=\"DISCOVER\">DISCOVER</option>\n        <option value=\"DANKORT\">DANKORT</option>\n        <option value=\"CARTEBLEUE\">CARTEBLEUE</option>\n        <option value=\"JCB\">JCB</option>\n      </select>\n    </li>    \n    <li class=\"ocLabel\">Credit Card Number</li>\n    <li>\n      <input name=\"cardNumber\" type=\"text\" id=\"cardNumber\" placeholder=\"";
  if (helper = helpers.plhrCardNumber) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrCardNumber); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"26\" maxlength=\"16\" autocomplete=\"off\" required/>\n    </li>\n    <li class=\"ocLabel\">Expiry and Security</li>\n    <li class=\"expiry\">\n      <input name=\"expirationMonth\" type=\"text\" id=\"expirationMonth\" placeholder=\"MM\" tabindex=\"27\" maxlength=\"2\" autocomplete=\"off\" required/>\n      <input name=\"expirationYear\" type=\"text\" id=\"expirationYear\" placeholder=\"YYYY\" tabindex=\"28\" maxlength=\"4\" autocomplete=\"off\" required/>\n      <input name=\"ccid\" type=\"text\" id=\"ccid\" placeholder=\"CVV\" tabindex=\"29\" maxlength=\"4\" autocomplete=\"off\" required/>\n    </li>\n  </ul>\n  <div class=\"response\"></div>\n</div>\n";
  return buffer;
  });
templates['community/myAccount/ReportView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n\n		<div id=\"monthlyTableWrapper\">\n			<h3>Monthly - Last 12 months</h3>\n			<p>Look at how your listing has been performing over the past 12 months. Note that introductions are a three step process: first, the user will see your listing in search results, which is a view; second the user can click on your listing and see more details (a click); and finally, the user can request an introduction. The introduction is where a StratPad user (a prospective client) sends an email to you, the service provider, through StratPad, the broker.</p>\n			<table id=\"monthlyTable\" class=\"reportTable\">\n				<thead>\n					<tr><td>&nbsp;</td></tr>\n				</thead>\n				<tbody>\n					<tr class=\"views\"><td>Views</td></tr>\n					<tr class=\"clicks\"><td>Clicks</td></tr>\n					<tr class=\"invites\"><td>Intros</td></tr>\n\n					<tr class=\"ctr\"><td>View to Click Rate</td></tr>\n					<tr class=\"itrFromClicks\"><td>Click to Intro Rate</td></tr>\n					<tr class=\"itrFromViews\"><td>View to Intro Rate</td></tr>\n				</tbody>\n			</table>	\n		</div>\n\n		<div id=\"summaryTableWrapper\">\n			<h3>";
  if (helper = helpers.summaryTableHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summaryTableHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n			<p>This table summarizes your listing's activity for all time, in $US.</p> \n			<table id=\"summaryTable\">\n				<tbody>\n					<tr><th># Views</th><td id=\"totalViews\"></td><th>Cost per View</th><td id=\"costPerView\"></td></tr>\n					<tr><th># Clicks</th><td id=\"totalClicks\"></td><th>Cost per Click</th><td id=\"costPerClick\"></td></tr>\n					<tr><th># Intros</th><td id=\"totalInvites\"></td><th>Cost per Intro</th><td id=\"costPerInvite\"></td></tr>\n					<tr><td colspan=\"2\">&nbsp;</td><th>Total Cost to Date*</th><td id=\"totalCost\"></td></tr>\n				</tbody>\n				<tfoot>\n					<tr><td colspan=\"4\">* Note that the total cost includes views/clicks/intros that may not have been charged at the current rate.</td></tr>\n				</tfoot>				\n			</table>\n		</div>\n\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n\n			<p>Sorry, you need to <a href=\"#\" id=\"connectSignup\">sign up for Connect</a> before viewing Reports.</p>\n\n		";
  }

  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.report_subtitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.report_subtitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"connectReport\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/community/my-connect-account/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasCompletedConnect), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['community/tooltips/ConnectProgress'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  buffer += "<div>\n	\n	<div id=\"progressStart\" class=\"progressMessage\">\n		<p>Complete all questions in the My Account pages to get listed in StratPad Connect. Look at this indicator bar to gauge your progress.</p>\n	</div>\n\n	<div id=\"progressMissing\" class=\"progressMessage\">\n		<p>Complete all questions in the My Account pages to get listed in StratPad Connect. <br> The following fields are missing:</p>\n		<ul>\n		    <li>Company name</li>\n		</ul>\n		<p id=\"timeRemaining\"></p>\n	</div>\n\n	<div id=\"progressComplete\" class=\"progressMessage\">\n		<p>Success! You are currently listed in StratPad Connect.</p>\n	</div>\n</div>";
  return buffer;
  });
templates['community/tooltips/Terms'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div>\n    <strong>StratPad Connect Terms &amp; Conditions</strong>\n    <a id=\"print\" href=\"#\"><i class=\"icon-ui-print\"></i></a>\n    <ul>\n      <li>You acknowledge that StratPad Inc. (we, us, our) will share the information you provide us with small business owners and their staff by displaying your information in our cloud-based Connect service. You grant us a non-exclusive license to display your information in Connect everywhere in the world.</li>\n      <li>You agree that we may send you an email (Introduction) with the first name and email address of a small business owner or their staff that we reasonably believe is interested in your product or service (Business).</li>\n      <li>You agree to reply to every Introduction by email within 1 business day from the time that we send it.</li>\n      <li>You agree to reply only ONCE to any single Introduction.</li>\n      <li>You agree that you will NEVER sell, give away or otherwise share any Introduction information unless and until you receive permission from the Business.</li>\n      <li>You agree that we may ask the Business for one or more ratings and one or more comments about their experience with you, and you further agree that we may publicly post these ratings and comments in Connect, and you further agree that we may use these ratings and comments to prioritize your listing inside Connect regardless of any other prioritization consideration.</li>\n      <li>You agree to pay a non-refundable fee of US$9.95 per year (or portion thereof) to be listed in Connect. You agree that we may charge these fees to your credit card.</li>\n      <li>You agree to pay a non-refundable fee for each Introduction. You acknowledge that these fees are set and managed by you in your Company Info screen. You agree that we may charge these fees to your credit card.</li>\n      <li>You agree that we may remove your listing from Connect at any time for any or no reason at our sole discretion.</li>\n      <li>You acknowledge that you may request that we remove your listing from Connect at any time by emailing \n      <a href=\"mailto:connect@stratpad.com\">connect@stratpad.com</a> and we agree to remove your listing within 5 business days of receiving your emailed request.</li>\n      <li>You agree to pay any and all outstanding fees even after you have requested that we remove your listing or even after we remove your listing.</li>\n      <li>You agree that any ratings, comments or information about your interaction with any Introduction or any Business becomes our sole property.</li>\n    </ul>\n</div>";
  });
templates['community/tooltips/businessBackground/businessStructure'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_businessStructure) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_businessStructure); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n<p>Some lenders may prefer certain business structures over others.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/businessTaxId'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_businessTaxId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_businessTaxId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>This is an important way to identify your business. For startups, having a business tax ID signifies the seriousness of your intent to be in business.</p>\n    <ul>\n    	<li><a target=\"_blank\" href=\"http://www.irs.gov/Businesses/Small-Businesses-%26-Self-Employed/Employer-ID-Numbers-EINs\">United States</a></li>\n    	<li><a target=\"_blank\" href=\"http://www.cra-arc.gc.ca/tx/bsnss/sm/menu-eng.html\">Canada</a></li>\n    </ul>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/duns'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_duns) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_duns); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Provide your business's D&amp;B (or DUNS) number, if you have it. This helps lenders assess the credit-worthiness of your business.</p>\n    <p>You can get a D&amp;B number here: <a target=\"_blank\" href=\"http://www.dnb.com\" target=\"_blank\">dnb.com</a></p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/financingTypeRequested'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_financingTypeRequested) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_financingTypeRequested); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Most lenders and investors will only make either loans or investments.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/industry'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_industry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_industry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Some lenders may prefer certain industries over others. Accurately select your business's NAICS code to find appropriate lenders.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/moneyRequired'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_moneyRequired) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_moneyRequired); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>A lender or investor need to know how much money your business needs.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/preferredLanguage'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_preferredLanguage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_preferredLanguage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porttitor metus in eros interdum accumsan. Maecenas finibus fringilla facilisis. Suspendisse scelerisque a mi et tristique. Donec mattis porttitor urna, nec vehicula purus. <strong>Phasellus dapibus hendrerit suscipit.</strong> Aliquam eu ligula nec metus malesuada consectetur. Vestibulum diam massa, tincidunt sed iaculis finibus, rhoncus porttitor lacus.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/profitable'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_profitable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_profitable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>The profitability of a business is used to determine its stage and credit-worthiness.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/requestedAssetTypes'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_requestedAssetTypes) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_requestedAssetTypes); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Lenders may have different products, preferences or terms that depend on how the money will be used.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/revenue'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_revenue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_revenue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Some lenders have a preference regarding the size of business they deal with. Annual revenue is one way to determine this.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/yearsInBusiness'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_yearsInBusiness) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_yearsInBusiness); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Some lenders focus on older businesses while others may focus on younger businesses (or startups).</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/businessBackground/zipOrPostalCode'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.bb_label_zipOrPostalCode) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bb_label_zipOrPostalCode); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Many lenders and investors have specific geographic areas in which they operate.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/accreditationLogos'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_accreditationLogos_tooltip) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_accreditationLogos_tooltip); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Up to 3 accreditation logos will be displayed to prospective clients (StratPad users) in their search results. Accreditations highlight and emphasize your listing in the search results.</p>\n    <p>Images must be in PNG (preferred), JPEG or GIF format. They must be under 500KB. Dimensions of 256px x 256px is recommended.</p>\n    <p>If your image appears rotated or flipped, try opening and exporting it from your computer before uploading.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/categories'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_categories) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_categories); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>You can be listed under one or two categories in Connect. eg. Mentors and Consultants. Feel free to suggest more categories, if you feel important ones are missing.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/companyLogo'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_companyLogo) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_companyLogo); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Your company logo will be displayed to prospective clients (StratPad users) in their search results. Images must be in PNG (preferred), JPEG or GIF format. They must be under 500KB. Dimensions of 256px x 256px is recommended.</p>\n    <p>If your image appears rotated or flipped, try opening and exporting it from your computer before uploading.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/monthlyAdBudget'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_monthlyAdBudget) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_monthlyAdBudget); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Place an upper limit on the number of leads you're willing to accept each month, by specifying a monthly budget. Once your budget is reached, your listing will not be available in the search results anymore.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/name'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Your company name will be displayed to prospective clients (StratPad users) in their search results.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/priceForInvitation'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_priceForInvitation) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_priceForInvitation); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>When a prospective client (StratPad user) clicks on your listing, and asks for an introduction, this is the price you're willing to pay. Higher bids move closer to the top of the search results.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/servicesDescription'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_servicesDescription) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_servicesDescription); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Your company description will be displayed to prospective clients (StratPad users) in their search results.</p>\n    <p>You can use bold (&lt;b&gt;), italic (&lt;i&gt;) and underline (&lt;u&gt;) html tags in your description.</p>\n    <p>For example, entering: &lt;u&gt;Welcome!&lt;/u&gt;</p> \n    <p>will result in: <u>Welcome!</u></p>     \n</article>";
  return buffer;
  });
templates['community/tooltips/companyInfoAndBudget/welcomeMessage'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.ci_label_welcomeMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ci_label_welcomeMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>After clicking on a search result, prospective clients will be shown your detailed services description, as part of a welcoming message.</p>\n    <p>You can use bold (&lt;b&gt;), italic (&lt;i&gt;), underline (&lt;u&gt;), paragraph (&lt;p&gt;) and list (&lt;ul&gt; &amp; &lt;li&gt;) html tags in your description.</p>\n    <p>For example, entering: &lt;u&gt;Welcome!&lt;/u&gt;</p> \n    <p>will result in: <u>Welcome!</u></p> \n</article>";
  return buffer;
  });
templates['community/tooltips/location/address1'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.location_label_address) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_address); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Your address is important to help us match you with nearby customers.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/location/location'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.location_label_location) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_location); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Your location is important to help us match you with nearby customers.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/location/payment'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.location_label_payment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_payment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Your credit card will be charged US$9.95 to be listed with StratPad Connect for each year or part thereof, unless canceled.</p>\n    <p>Complete all required questions (prefixed with an asterisk *) before paying.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/location/termsAccepted'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.location_label_terms) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_terms); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Read through the terms and conditions carefully before agreeing to them. There are important instructions contained within, \n    	critical to your success as a service provider within StratPad.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/location/zipPostal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.location_label_zipPostal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_label_zipPostal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Your zip or postal code is important to help us match you with nearby customers.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/personalCreditHistory/bankrupt'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.pch_label_bankrupt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_bankrupt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Lenders may wish to assess the strength of the primary shareholder's character. It is important to be forthright about a personal bankruptcy.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/personalCreditHistory/birthdate'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.pch_label_birthdate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_birthdate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Lenders may have a preference related to the age of the primary shareholder.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/personalCreditHistory/criminalRecord'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.pch_label_criminalRecord) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_criminalRecord); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Lenders may wish to assess the strength of the primary shareholder's character. It is important to be forthright about a criminal record.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/personalCreditHistory/fico'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.pch_label_fico) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_fico); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Depending on their assessment of the businesses, lenders may also wish to assess the credit-worthiness of the primary shareholder. The FICO score of the primary shareholder increase the lender's assessment of the business's credit-worthiness. Check your credit score at <a target=\"_blank\" href=\"http://www.shareasale.com/r.cfm?b=402305&u=989322&m=41089&urllink=&afftrack=\">myfico.com</a>.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/personalCreditHistory/gender'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.pch_label_gender) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_gender); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Lenders may have a preference related to the gender of the primary shareholder.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/personalCreditHistory/ssnSin'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.pch_label_ssnSin) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_ssnSin); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Depending on their assessment of the businesses, lenders may also wish to assess the credit-worthiness of the primary shareholder. The SSN/SIN helps to identify the primary shareholder.</p>\n</article>";
  return buffer;
  });
templates['community/tooltips/personalCreditHistory/veteran'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>";
  if (helper = helpers.pch_label_veteran) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pch_label_veteran); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n</header>\n<article>\n    <p>Some lenders have specialized products, services or rates for veterans.</p>\n</article>";
  return buffer;
  });
templates['dialogs/AcceptInviteDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			";
  if (helper = helpers.acceptanceDialogInfo) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.acceptanceDialogInfo); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n		";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			";
  if (helper = helpers.acceptanceDialogAtLimit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.acceptanceDialogAtLimit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n		";
  return buffer;
  }

  buffer += "<div id=\"acceptSharedStratfileDialog\">\n	<div class=\"dialogMessage\">\n		";
  if (helper = helpers.acceptanceDialogMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.acceptanceDialogMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</div>\n	<div class=\"dialogInfo\">\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.canAddSharedFile), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</div>\n</div>";
  return buffer;
  });
templates['dialogs/ChangePassword'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"changePasswordDialog\">\n	<div id=\"changePassMessage\">\n		";
  if (helper = helpers.changePassword_msg_generic) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_msg_generic); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</div>\n	<input type=\"password\" placeholder=\"";
  if (helper = helpers.changePassword_plhdr_oldPassword) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_plhdr_oldPassword); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"oldPassword\" />\n	<div class=\"validatePasswordWrap\">\n		<input type=\"password\" placeholder=\"";
  if (helper = helpers.changePassword_plhdr_newPassword) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_plhdr_newPassword); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"newPassword\" />\n		<input type=\"password\" placeholder=\"";
  if (helper = helpers.changePassword_plhdr_confirmPassword) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_plhdr_confirmPassword); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"confirmNewPassword\" />\n	</div>\n	<div id=\"validatePasswordMessage\"></div>\n	<div id=\"changePasswordSuccess\" class=\"message success\">";
  if (helper = helpers.changePassword_success) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_success); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n	<div id=\"changePasswordError\"><div class=\"message error\">";
  if (helper = helpers.changePassword_error) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_error); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " <div id=\"changePasswordErrorMessage\"></div></div></div>\n</div>\n";
  return buffer;
  });
templates['dialogs/EditProfile'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<input name=\"firstname\" type=\"text\" placeholder=\"";
  if (helper = helpers.editProfile_firstName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.editProfile_firstName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" required />\n<input name=\"lastname\" type=\"text\" placeholder=\"";
  if (helper = helpers.editProfile_lastName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.editProfile_lastName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" required />\n";
  return buffer;
  });
templates['dialogs/EmailDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"emailSuccessError\"></div>\n<div id=\"emailDialog\">\n	<div id=\"emailInfo\">\n		";
  if (helper = helpers.emailDialog_msg_generic) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_msg_generic); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</div>\n	<div id=\"emailOptions\">\n		<ul class=\"group fileTypeGrid\">\n			<li>\n				<label id=\"emailPdfRadio\" class=\"emailOptionLabel typePdf\" for=\"emailpdf\" data-fileType=\"pdf\">\n					<input type=\"radio\" id=\"emailpdf\" name=\"emailSelection\" value=\"pdf\">\n					<i class=\"icon-ui-file-pdf\"></i>\n					";
  if (helper = helpers.emailDialog_pdf_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_pdf_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n			<li>\n				<label id=\"emailWordRadio\" class=\"emailOptionLabel typeDocx\" for=\"emaildocx\" data-fileType=\"docx\">\n					<input type=\"radio\" id=\"emaildocx\" name=\"emailSelection\" value=\"docx\">\n					<i class=\"icon-ui-file-word\"></i>\n					";
  if (helper = helpers.emailDialog_docx_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_docx_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n			<li>\n				<label id=\"emailCsvRadio\" class=\"emailOptionLabel typeCsv\" for=\"emailcsv\" data-fileType=\"csv\">\n					<input type=\"radio\" id=\"emailcsv\" name=\"emailSelection\" value=\"csv\">\n					<i class=\"icon-ui-file-excel\"></i>\n					";
  if (helper = helpers.emailDialog_csv_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_csv_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n			<li>\n				<label id=\"emailStratFileRadio\" class=\"emailOptionLabel typeStratfile\" for=\"emailstratfile\" data-fileType=\"stratfile\">\n					<input type=\"radio\" id=\"emailstratfile\" name=\"emailSelection\" value=\"stratfile\">\n					<i class=\"icon-ui-file\"></i>\n					";
  if (helper = helpers.emailDialog_stratfile_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_stratfile_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n		</ul>\n	</div>\n	<div id=\"emailFileInfo\"></div>\n	<div id=\"emailInstructions\">\n		<h6>";
  if (helper = helpers.emailDialog_instructions_header) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_instructions_header); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h6>\n		";
  if (helper = helpers.emailDialog_instructions_body) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_instructions_body); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n		<a href=\"#\" id=\"mailtoOthersTrigger\"><i class=\"icon-ui-arrow-down-2\"></i>";
  if (helper = helpers.emailDialog_externalMailLink) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_externalMailLink); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n	</div>\n	<div id=\"emailOthers\">\n		<!-- could add multi-address hint here -->\n		<fieldset>\n			<label for=\"emailRecipients\">";
  if (helper = helpers.emailDialog_label_emailRecipient) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_label_emailRecipient); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n			<input id=\"emailRecepients\" class=\"emailInput\" data-key=\"to\" type=\"email\" placeholder=\"";
  if (helper = helpers.emailDialog_plhrEmailRecepients) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_plhrEmailRecepients); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n			<label for=\"emailSubject\">";
  if (helper = helpers.emailDialog_label_emailSubject) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_label_emailSubject); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n			<input id=\"emailSubject\" class=\"emailInput\" data-key=\"subject\" type=\"text\" />\n			<label for=\"emailMessage\">";
  if (helper = helpers.emailDialog_label_emailMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_label_emailMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n			<textarea id=\"emailMessage\" data-key=\"message\" class=\"emailInput\"></textarea>\n		</fieldset>\n		<a href=\"#\" id=\"cancelmailtoOthers\"><i class=\"icon-misc-remove-sign\"></i>";
  if (helper = helpers.emailDialog_cancelExternalMailLink) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emailDialog_cancelExternalMailLink); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n	</div>\n</div>\n";
  return buffer;
  });
templates['dialogs/ExportDialog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"exportDialog\">\n	<div id=\"exportMessage\">\n		";
  if (helper = helpers.exportDialog_msg_generic) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.exportDialog_msg_generic); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</div>\n	<div id=\"exportOptions\">\n		<ul class=\"group fileTypeGrid\">\n			<li>\n				<label id=\"exportPdfRadio\" class=\"exportOptionLabel typePdf\" for=\"exportpdf\" data-fileType=\"pdf\">\n					<input type=\"radio\" id=\"exportpdf\" name=\"exportSelection\" value=\"pdf\">\n					<i class=\"icon-ui-file-pdf\"></i>\n					";
  if (helper = helpers.exportDialog_pdf_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.exportDialog_pdf_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n			<li>\n				<label id=\"exportWordRadio\" class=\"exportOptionLabel typeDocx\" for=\"exportdocx\" data-fileType=\"docx\">\n					<input type=\"radio\" id=\"exportdocx\" name=\"exportSelection\" value=\"docx\">\n					<i class=\"icon-ui-file-word\"></i>\n					";
  if (helper = helpers.exportDialog_docx_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.exportDialog_docx_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n			<li>\n				<label id=\"exportCsvRadio\" class=\"exportOptionLabel typeCsv\" for=\"exportcsv\" data-fileType=\"csv\">\n					<input type=\"radio\" id=\"exportcsv\" name=\"exportSelection\" value=\"csv\">\n					<i class=\"icon-ui-file-excel\"></i>\n					";
  if (helper = helpers.exportDialog_csv_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.exportDialog_csv_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n			<li>\n				<label id=\"exportStratFileRadio\" class=\"exportOptionLabel typeStratfile\" for=\"exportstratfile\" data-fileType=\"stratfile\">\n					<input type=\"radio\" id=\"exportstratfile\" name=\"exportSelection\" value=\"stratfile\">\n					<i class=\"icon-ui-file\"></i>\n					";
  if (helper = helpers.exportDialog_stratfile_generic_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.exportDialog_stratfile_generic_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</label>\n			</li>\n		</ul>\n	</div>\n	<div id=\"exportFileInfo\"></div>\n</div>\n";
  return buffer;
  });
templates['dialogs/FileUpload'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"fileUploadDialog\">\n  <a href=\"#\" class=\"icon-ui-file-plus button\" id=\"upload\">\n    <span>\n      <b>";
  if (helper = helpers.importDialog_btn_select_files) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.importDialog_btn_select_files); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n    </span>\n  </a>\n\n  \n  <input id=\"fileupload\" type=\"file\" name=\"files[]\" />\n\n  <div id=\"overwrite\">\n  <label><input name=\"overwrite\" type=\"radio\" value=\"replace\" />";
  if (helper = helpers.importDialog_lbl_overwrite_replace) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.importDialog_lbl_overwrite_replace); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n  <label><input name=\"overwrite\" type=\"radio\" value=\"keepboth\" />";
  if (helper = helpers.importDialog_lbl_overwrite_keepboth) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.importDialog_lbl_overwrite_keepboth); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n  </div>\n\n  <!-- The global progress bar -->\n  <div class=\"progressBar\">\n    <div></div>\n  </div>\n</div>\n";
  return buffer;
  });
templates['dialogs/PrintPopup'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<style type=\"text/css\">\n	body { color: dimgrey; font: normal normal 100%/1.5 OpenSans, Helvetica, \"Helvetica Neue\", Arial, sans-serif; margin-top: 50px; }\n	p { text-align: center; }\n	#loading {font-weight: 600}\n</style>\n\n<div>\n	<p>Loading...</p>\n	<p>Click the print icon or choose print from the file menu when loading is finished.</p>\n	<p>With some browser combinations, you may need to check your download folder for a pdf file, if it doesn't show up here.</p>\n	<p>Close this window when finished printing.</p>\n</div>";
  });
templates['dialogs/WelcomeQBO'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Track Your Progress</h1>\n<img src=\"/images/ipp-welcome.jpg\" />\n<ul class=\"cleanList l-grid l-col-33\">\n	<li>\n		<h2>Plan</h2>\n		<p>your business<br />with <strong>StratPad Cloud</strong></p>\n	</li>\n	<li>\n		<h2>Run</h2>\n		<p>your business<br />with <strong>QuickBooks Online</strong></p>\n	</li>\n	<li>\n		<h2>Track</h2>\n		<p>your progress<br />by <strong>linking them</strong></p>\n	</li>\n</ul>\n<span class=\"qboCopyright\">QuickBooks is a registered trademark of Intuit Inc. and is displayed under license.</span>";
  });
templates['dialogs/WelcomeVideo'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"welcomeVideoModal\">\n	<iframe height=\"415\" frameborder=\"0\" width=\"715\" allowfullscreen=\"\" mozallowfullscreen=\"\" webkitallowfullscreen=\"\" title=\"About Your Company\" src=\"//player.vimeo.com/video/83403599\"></iframe>\n</div>\n";
  });
templates['forms/ActivitiesDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n  <hgroup>\n    <h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <h2>&#160;</h2>\n  </hgroup>\n</header>\n<section id=\"f7\">\n  <article class=\"objectiveActivities\">\n	  <div class=\"stratFileHelp\">\n		  <iframe src=\"\" data-url=\"help/write-your-plan/activity/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n	  </div>\n    <div class=\"permissions\"></div>\n    <div class=\"stageContentInner\">\n      <ul class=\"activityLabels activityRow group\">\n        <li>Action</li>\n        <li>Responsible</li>\n        <li>Upfront Cost</li>\n        <li>Ongoing Cost</li>\n      </ul>\n      <ul id=\"activitiesSortable\" class=\"sortable ui-sortable\"></ul>\n      <a href=\"#\" class=\"button addButton\">\n      <span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.btnAddActivity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnAddActivity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </div>\n  </article>\n  <script type=\"text/template\" id=\"activityDetailsDialog\">\n    <ul id=\"activityFields\" class=\"group s1_formPanel dialogFields\">\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAction) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAction); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"activityAction\" type=\"text\" id=\"activityAction\" placeholder=\"";
  if (helper = helpers.plhrActivityAction) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrActivityAction); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n      </li>\n\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblActivityResponsible) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblActivityResponsible); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"activityResponsible\" type=\"hidden\" id=\"activityResponsible\" class=\"select2\" />\n      </li>\n\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblStartDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblStartDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n		<div class=\"datepickerWrapper\">\n			<i class=\"icon-ui-calendar-2\"></i>\n			<input id=\"activityStartDate\" type=\"text\" name=\"activityStartDate\" placeholder=\"";
  if (helper = helpers.plhrStartDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrStartDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\" />\n		</div>\n      </li>\n\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblEndDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblEndDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n		<div class=\"datepickerWrapper\">\n			<i class=\"icon-ui-calendar-2\"></i>\n			<input id=\"activityEndDate\" type=\"text\" name=\"activityEndDate\" placeholder=\"";
  if (helper = helpers.plhrEndDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrEndDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\"/>\n		</div>\n      </li>\n\n      <li class=\"ocLabel\">\n        ";
  if (helper = helpers.lblUpfrontCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblUpfrontCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        <div>";
  if (helper = helpers.expensesGA) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.expensesGA); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n      </li>\n      <li>\n        <input name=\"activityUpfrontCost\" type=\"number\" id=\"activityUpfrontCost\" placeholder=\"";
  if (helper = helpers.plhrActivityUpfrontCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrActivityUpfrontCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n      </li>\n\n      <li class=\"ocLabel\">\n        ";
  if (helper = helpers.lblOngoingCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblOngoingCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        <div>";
  if (helper = helpers.expensesGA) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.expensesGA); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n      </li>\n      <li>\n        <input name=\"activityOngoingCost\" type=\"number\" id=\"activityOngoingCost\" placeholder=\"";
  if (helper = helpers.plhrActivityOngoingCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrActivityOngoingCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n      </li>\n\n\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblOngoingFrequency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblOngoingFrequency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <select name=\"activityOngoingFrequency\" id=\"activityOngoingFrequency\" class=\"select2\">\n          <option value=\"MONTHLY\">";
  if (helper = helpers.MONTHLY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.MONTHLY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"QUARTERLY\">";
  if (helper = helpers.QUARTERLY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.QUARTERLY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"ANNUALLY\">";
  if (helper = helpers.ANNUALLY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ANNUALLY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n        </select>\n      </li>\n    </ul>\n  </script>\n</section>\n";
  return buffer;
  });
templates['forms/ActivityRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ul class=\"activityRow group\">\n  <li>\n    <span>";
  stack1 = (helper = helpers.displayProp || (depth0 && depth0.displayProp),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.activity), "action", options) : helperMissing.call(depth0, "displayProp", (depth0 && depth0.activity), "action", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n    <span class=\"timeframe\">";
  if (helper = helpers.timeframe) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.timeframe); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n  </li>\n  <li>";
  stack1 = (helper = helpers.displayProp || (depth0 && depth0.displayProp),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.activity), "responsible", options) : helperMissing.call(depth0, "displayProp", (depth0 && depth0.activity), "responsible", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n  <li>";
  stack1 = (helper = helpers.displayProp || (depth0 && depth0.displayProp),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.activity), "upfrontCost", options) : helperMissing.call(depth0, "displayProp", (depth0 && depth0.activity), "upfrontCost", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n  <li>";
  if (helper = helpers.ongoing) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ongoing); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n</ul>\n<nav>\n  <a href=\"#\" class=\"icon-ui-remove deleteActivity\" title=\"";
  if (helper = helpers.dialogConfirmDelete) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmDelete); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n</nav>\n";
  return buffer;
  });
templates['forms/F1.AboutYourStrategy'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section id=\"f1\">\n	<article class=\"stratFileForm\">\n		<h2>";
  if (helper = helpers.subtitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/about-your-company/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"formPanel\" autocomplete=\"off\">\n			<fieldset>\n				<ul>\n					<li>\n						<label for=\"name\">";
  if (helper = helpers.lblName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n						<div class=\"permissions\"></div>						\n						<input id=\"name\" type=\"text\" name=\"name\" placeholder=\"";
  if (helper = helpers.plhrName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" autofocus />\n					</li>\n					<li>\n						<label for=\"companyName\">";
  if (helper = helpers.lblCompanyName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblCompanyName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n						<div class=\"permissions\"></div>\n						<input id=\"companyName\" type=\"text\" name=\"companyName\" placeholder=\"";
  if (helper = helpers.plhrCompanyName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrCompanyName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n					</li>\n					<li>\n						<label for=\"location\" class=\"two-lines\"><a id=\"suggestCity\" href=\"#\">Can't find your city?</a>";
  if (helper = helpers.lblLocation) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLocation); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>			\n	                    <select id=\"location\" name=\"location\" class=\"location\" placeholder=\"";
  if (helper = helpers.plhrLocation) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLocation); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></select>						\n					</li>\n					<li>\n						<label for=\"currency\">";
  if (helper = helpers.lblCurrency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblCurrency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n						<div class=\"permissions\"></div>\n						<input id=\"currency\" type=\"text\" name=\"currency\" placeholder=\"";
  if (helper = helpers.plhrCurrency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrCurrency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n					</li>\n					<li>\n						<label for=\"industry\" class=\"two-lines\">";
  if (helper = helpers.lblIndustry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblIndustry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<span>";
  if (helper = helpers.subLblIndustry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subLblIndustry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></label>\n						<select id=\"industry\" name=\"industry\" class=\"industries\" placeholder=\"";
  if (helper = helpers.plhrIndustry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrIndustry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></select>\n					</li>\n					<li>\n						<label>";
  if (helper = helpers.lblFinancialLink) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblFinancialLink); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n						<div id=\"ippConnection\">\n							<ipp:connectToIntuit></ipp:connectToIntuit>\n							<div id=\"ippConnected\">\n								<span>";
  if (helper = helpers.lblConnected) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblConnected); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n								<a href=\"#\">";
  if (helper = helpers.btnDisconnect) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnDisconnect); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n							</div>\n						</div>\n					</li>\n				</ul>\n			</fieldset>\n		</form>\n		<div class=\"clickNextHelper\"><span>Click here <strong>after</strong><br />you've completed this page.</span></div>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/F4.ThemeDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n  <hgroup>\n    <h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n  </hgroup>\n</header>\n<section id=\"f4\">\n  <article class=\"themeDetail\">\n    <div class=\"stratFileHelp\">\n      <iframe src=\"\" data-url=\"help/write-your-plan/projects/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\"></iframe>\n    </div>\n    <form class=\"s1_formPanel\">\n      <ul data-locked=\"true\">\n        <!-- Section 1 -->\n        <li>\n          <h2>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n          <input id=\"name\" type=\"text\" name=\"name\" tabindex=\"2\" placeholder=\"";
  if (helper = helpers.plhrName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n        </li>\n        <!-- Section 2 BOOLS have been removed. -->\n        <!-- Section 3 -->\n        <li class=\"themeStage\">\n          <h2>";
  if (helper = helpers.s3Header) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.s3Header); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n          <div class=\"stageContent\">\n            <div class=\"stageContentInner\">\n              <ul class=\"l-grid l-col-50and25 dateThemeSettings\">\n                <li>\n                  <label for=\"responsible\">";
  if (helper = helpers.lblResponsible) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblResponsible); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                  <select id=\"responsible\" name=\"responsible\" class=\"responsible\" placeholder=\"";
  if (helper = helpers.plhrResponsible) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrResponsible); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabIndex=\"4\"></select>           \n                </li>\n                <li>\n                  <label for=\"startDate\">";
  if (helper = helpers.lblStartDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblStartDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                  <div class=\"datepickerWrapper\">\n                    <i class=\"icon-ui-calendar-2\"></i>\n                    <input id=\"startDate\" type=\"text\" name=\"startDate\" placeholder=\"";
  if (helper = helpers.plhrStartDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrStartDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\" tabindex=\"5\" />\n                  </div>\n                </li>\n                <li>\n                  <label for=\"endDate\">";
  if (helper = helpers.lblEndDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblEndDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                  <div class=\"datepickerWrapper\">\n                    <i class=\"icon-ui-calendar-2\"></i>\n                    <input id=\"endDate\" type=\"text\" name=\"endDate\" placeholder=\"";
  if (helper = helpers.plhrEndDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrEndDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\" tabindex=\"6\" />\n                  </div>\n                </li>\n              </ul>\n            </div>\n          </div>\n        </li>\n        <!-- Section 4 -->\n        <li id=\"oneTimeAndMonthly\" class=\"themeStage\">\n          <h2>";
  if (helper = helpers.s4Header) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.s4Header); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n          <div class=\"stageContent\">\n            <div class=\"stageContentInner\">\n              <p class=\"themeFinInfo\">";
  if (helper = helpers.themeFinancialChangesInfo) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.themeFinancialChangesInfo); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n              <table>\n                <tbody>\n                  <tr class=\"themeFinTableHeader\">\n                    <th colspan=\"3\" class=\"first\">\n                      <h2 class=\"themeFinHeader\">";
  if (helper = helpers.oneTimeMonthlyHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.oneTimeMonthlyHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n                    </th>\n                    <th>";
  if (helper = helpers.thOneTime) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thOneTime); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n                    <th>";
  if (helper = helpers.thMonthly) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thMonthly); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n                    <th>";
  if (helper = helpers.thMonthlyAdjustment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thMonthlyAdjustment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n                  </tr>\n                  <tr>\n                    <td colspan=\"3\" class=\"first\">";
  if (helper = helpers.rhRevenue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhRevenue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"revenueOneTime\" class=\"themeFinChanges\" type=\"number\" name=\"revenueOneTime\" tabindex=\"20\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"revenueMonthly\" class=\"themeFinChanges\" type=\"number\" name=\"revenueMonthly\" tabindex=\"21\" />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"revenueMonthlyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"revenueMonthlyAdjustment\" tabindex=\"22\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"3\" class=\"first\">";
  if (helper = helpers.rhCogs) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhCogs); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"cogsOneTime\" class=\"themeFinChanges\" type=\"number\" name=\"cogsOneTime\" tabindex=\"23\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"cogsMonthly\" class=\"themeFinChanges\" type=\"number\" name=\"cogsMonthly\" tabindex=\"24\" />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"cogsMonthlyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"cogsMonthlyAdjustment\" tabindex=\"25\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"3\" class=\"first\">";
  if (helper = helpers.rhGaa) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhGaa); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"generalAndAdminOneTime\" class=\"themeFinChanges\" type=\"number\" name=\"generalAndAdminOneTime\" tabindex=\"26\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"generalAndAdminMonthly\" class=\"themeFinChanges\" type=\"number\" name=\"generalAndAdminMonthly\" tabindex=\"27\" />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"generalAndAdminMonthlyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"generalAndAdminMonthlyAdjustment\" tabindex=\"28\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"3\" class=\"first\">";
  if (helper = helpers.rhRad) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhRad); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"researchAndDevelopmentOneTime\" class=\"themeFinChanges\" type=\"number\" name=\"researchAndDevelopmentOneTime\" tabindex=\"29\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"researchAndDevelopmentMonthly\" class=\"themeFinChanges\" type=\"number\" name=\"researchAndDevelopmentMonthly\" tabindex=\"30\" />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"researchAndDevelopmentMonthlyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"researchAndDevelopmentMonthlyAdjustment\" tabindex=\"31\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"3\" class=\"first\">";
  if (helper = helpers.rhSam) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhSam); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"salesAndMarketingOneTime\" type=\"number\" class=\"themeFinChanges\" name=\"salesAndMarketingOneTime\" tabindex=\"32\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"salesAndMarketingMonthly\" type=\"number\" class=\"themeFinChanges\" name=\"salesAndMarketingMonthly\" tabindex=\"33\" />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"salesAndMarketingMonthlyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"salesAndMarketingMonthlyAdjustment\" tabindex=\"34\" />\n                    </td>\n                  </tr>\n                  <!-- calculated -->\n                  <tr class=\"last\">\n                    <td colspan=\"2\" class=\"first\">";
  if (helper = helpers.rhBenefit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhBenefit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n                    <td>\n                      <div class=\"benefitTotal displayInput\"></div>\n                    </td>\n                    <td>\n                      <div id=\"benefitOneTime\" class=\"displayInput\"></div>\n                    </td>\n                    <td>\n                      <div id=\"benefitMonthly\" class=\"displayInput\"></div>\n                    </td>\n                    <td>\n                      <div class=\"displayInput inactive\"></div>\n                    </td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </li>\n        <!-- Section 5 -->\n        <li id=\"seasonallyAndAnnually\" class=\"themeStage\">\n          <div class=\"stageContent\">\n            <div class=\"stageContentInner\">\n              <table>\n                <tbody>\n                  <tr class=\"themeFinTableHeader\">\n                    <th colspan=\"4\" class=\"first\">\n                      <h2 class=\"themeFinHeader\">";
  if (helper = helpers.seasonallyAndAnnuallyHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.seasonallyAndAnnuallyHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n                    </th>\n                    <th>";
  if (helper = helpers.thAnnually) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thAnnually); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n                    <th>";
  if (helper = helpers.thSeasonally) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thSeasonally); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n                    <th>";
  if (helper = helpers.thAnnuallyAdjustment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.thAnnuallyAdjustment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n                  </tr>\n                  <tr>\n                    <td colspan=\"4\" class=\"first\">";
  if (helper = helpers.rhRevenue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhRevenue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"revenueAnnually\" class=\"themeFinChanges\" type=\"number\" name=\"revenueAnnually\" tabindex=\"38\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-weather-snow projectSeasonalIcon\"></i>\n                        <input id=\"revenueSeasonalAdjustment\" class=\"seasonal\" type=\"text\" name=\"revenueSeasonalAdjustment\" data-key=\"revenue\" tabindex=\"39\" readonly />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"revenueAnnuallyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"revenueAnnuallyAdjustment\" tabindex=\"40\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"4\" class=\"first\">";
  if (helper = helpers.rhCogs) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhCogs); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"cogsAnnually\" class=\"themeFinChanges\" type=\"number\" name=\"cogsAnnually\" tabindex=\"41\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-weather-snow projectSeasonalIcon\"></i>\n                        <input id=\"cogsSeasonalAdjustment\" class=\"seasonal\" type=\"text\" name=\"cogsSeasonalAdjustment\" data-key=\"cogs\" tabindex=\"42\" readonly />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"cogsAnnuallyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"cogsAnnuallyAdjustment\" tabindex=\"43\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"4\" class=\"first\">";
  if (helper = helpers.rhGaa) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhGaa); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"generalAndAdminAnnually\" class=\"themeFinChanges\" type=\"number\" name=\"generalAndAdminAnnually\" tabindex=\"44\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-weather-snow projectSeasonalIcon\"></i>\n                        <input id=\"generalAndAdminSeasonalAdjustment\" class=\"seasonal\" type=\"text\" name=\"generalAndAdminSeasonalAdjustment\" data-key=\"generalAndAdmin\" tabindex=\"45\" readonly />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"generalAndAdminAnnuallyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"generalAndAdminAnnuallyAdjustment\" tabindex=\"46\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"4\" class=\"first\">";
  if (helper = helpers.rhRad) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhRad); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"researchAndDevelopmentAnnually\" class=\"themeFinChanges\" type=\"number\" name=\"researchAndDevelopmentAnnually\" tabindex=\"47\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-weather-snow projectSeasonalIcon\"></i>\n                        <input id=\"researchAndDevelopmentSeasonalAdjustment\" class=\"seasonal\" type=\"text\" name=\"researchAndDevelopmentSeasonalAdjustment\" data-key=\"researchAndDevelopment\" readonly tabindex=\"48\" />\n                      </div>\n                    </td>\n                    <td>\n                      <input id=\"researchAndDevelopmentAnnuallyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"researchAndDevelopmentAnnuallyAdjustment\" tabindex=\"49\" />\n                    </td>\n                  </tr>\n                  <tr>\n                    <td colspan=\"4\" class=\"first\">";
  if (helper = helpers.rhSam) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhSam); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-th-list projectNotesIcon\" title=\"";
  if (helper = helpers.notesTooltipTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTooltipTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n                        <input id=\"salesAndMarketingAnnually\" type=\"number\" class=\"themeFinChanges\" name=\"salesAndMarketingAnnually\" tabindex=\"50\" />\n                      </div>\n                    </td>\n                    <td>\n                      <div class=\"themeFinChangesWrap\">\n                        <i class=\"icon-new-weather-snow projectSeasonalIcon\"></i>\n                        <input id=\"salesAndMarketingSeasonalAdjustment\" class=\"seasonal\" type=\"text\" name=\"salesAndMarketingSeasonalAdjustment\" data-key=\"salesAndMarketing\" tabindex=\"51\" readonly />\n                      </div>                    	\n                    </td>\n                    <td>\n                      <input id=\"salesAndMarketingAnnuallyAdjustment\" class=\"themeFinAdjustment\" type=\"number\" name=\"salesAndMarketingAnnuallyAdjustment\" tabindex=\"52\" onFocus=\"this.tabIndex=1;\" onBlur=\"this.tabIndex=52;\" />\n                    </td>\n                  </tr>\n                  <tr class=\"last\">\n                    <td colspan=\"3\" class=\"first\">";
  if (helper = helpers.rhBenefit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rhBenefit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n                    <td>\n                      <div class=\"benefitTotal displayInput\"></div>\n                    </td>                    \n                    <td>\n                      <div id=\"benefitAnnually\" class=\"displayInput\"></div>\n                    </td>\n                    <td>\n                      <div class=\"displayInput inactive\"></div>\n                    </td>\n                    <td>\n                      <div class=\"displayInput inactive\"></div>\n                    </td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </li>\n      </ul>\n      <div class=\"permissions\"></div>\n    </form>\n  </article>\n</section>\n";
  return buffer;
  });
templates['forms/MetricRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ul class=\"metricRow group\">\n  <li>\n    <input name=\"metricSummary_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text\" id=\"metricSummary_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (helper = helpers.plhrMetricSummary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrMetricSummary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"/>\n  </li>\n  <li id=\"successIndicator_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    <input type=\"radio\" id=\"successIndicator_gt_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" name=\"successIndicator_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"MEET_OR_EXCEED\"/>\n    <label for=\"successIndicator_gt_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.gt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.gt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n    <br />\n    <input type=\"radio\" id=\"successIndicator_lt_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" name=\"successIndicator_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"MEET_OR_SUBCEDE\" />\n    <label for=\"successIndicator_lt_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.lt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n  </li>\n  <li>\n    <input name=\"targetValue_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text\" id=\"targetValue_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (helper = helpers.plhrTargetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrTargetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.targetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.targetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"/>\n  </li>\n  <li>\n    <div class=\"datepickerWrapper\">\n      <i class=\"icon-ui-calendar-2\"></i>\n      <input id=\"metricTargetDate_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text\" name=\"metricTargetDate_";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (helper = helpers.plhrTargetDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrTargetDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\"/>\n    </div>\n  </li>\n</ul>\n<nav>\n  <a href=\"#\" class=\"icon-ui-remove deleteMetric\" title=\"";
  if (helper = helpers.dialogConfirmDeleteMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmDeleteMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n</nav>\n\n";
  return buffer;
  });
templates['forms/NoActivitiesRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"activitySortableItem\">\n	<ul class=\"activityRow group\">\n		<li class=\"noActivities\">";
  if (helper = helpers.noActivities) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.noActivities); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n	</ul>\n</li>\n";
  return buffer;
  });
templates['forms/NoMetricsRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"metricItem\">\n	<ul class=\"metricRow group\">\n		<li class=\"noMetrics\">";
  if (helper = helpers.noMetrics) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.noMetrics); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n	</ul>\n</li>\n";
  return buffer;
  });
templates['forms/NoObjectivesRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"objectiveSortableItem\">\n	<ul class=\"objectiveRow group\">\n		<li class=\"noObjectives\">";
  if (helper = helpers.noObjectives) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.noObjectives); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n	</ul>\n</li>\n";
  return buffer;
  });
templates['forms/ObjectiveRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ul class=\"objectiveRow group\">\n  <li>";
  if (helper = helpers.summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n  <li class=\"";
  if (helper = helpers.metricSummaryClassname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.metricSummaryClassname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.metricSummary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.metricSummary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n  <li>";
  if (helper = helpers.targetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.targetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n  <li>";
  if (helper = helpers.targetDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.targetDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n  <li>";
  if (helper = helpers.localizedReviewFrequency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.localizedReviewFrequency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n</ul>\n<nav>\n  <a href=\"#\" class=\"icon-ui-remove deleteObjective\" title=\"";
  if (helper = helpers.dialogConfirmDelete) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmDelete); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n</nav>";
  return buffer;
  });
templates['forms/ObjectivesDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n	    <h2>&#160;</h2>\n	</hgroup>\n</header>\n<section id=\"f6\">\n	<article class=\"themeObjective\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/objectives/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<div class=\"permissions\"></div>\n		<ul>\n			<!-- Section 1 -->\n			<li class=\"objectiveStage\">\n				<div class=\"stageHeader\">\n					<h2><span>";
  if (helper = helpers.financialTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.financialTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> <b>";
  if (helper = helpers.financialDesc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.financialDesc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b></h2>\n					<i class=\"icon-misc-plus\" data-type=\"FINANCIAL\" title=\"";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n				</div>\n				<div class=\"stageContent\">\n					<div class=\"stageContentInner\">\n						<ul class=\"objectiveLabels objectiveRow group\">\n							<li>";
  if (helper = helpers.lblObjective) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblObjective); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblTargetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblTargetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblByWhen) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblByWhen); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblReviewRate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblReviewRate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n						</ul>\n						<ul id=\"financialSortable\" class=\"sortable\"></ul>\n						<!-- <a href=\"#\" class=\"button addButton\" data-type=\"FINANCIAL\"><span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a> -->\n					</div>\n				</div>\n			</li>\n			<!-- Section 2 -->\n			<li class=\"objectiveStage\">\n				<div class=\"stageHeader\">\n					<h2><span>";
  if (helper = helpers.customerTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.customerTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> <b>";
  if (helper = helpers.customerDesc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.customerDesc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b></h2>\n					<i class=\"icon-misc-plus\" data-type=\"CUSTOMER\" title=\"";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n				</div>\n				<div class=\"stageContent\">\n					<div class=\"stageContentInner\">\n						<ul class=\"objectiveLabels objectiveRow group\">\n							<li>";
  if (helper = helpers.lblObjective) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblObjective); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblTargetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblTargetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblByWhen) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblByWhen); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblReviewRate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblReviewRate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n						</ul>\n						<ul id=\"customerSortable\" class=\"sortable\"></ul>\n						<!-- <a href=\"#\" class=\"button addButton\" data-type=\"CUSTOMER\"><span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a> -->\n					</div>\n				</div>\n			</li>\n			<!-- Section 3 -->\n			<li class=\"objectiveStage\">\n				<div class=\"stageHeader\">\n					<h2><span>";
  if (helper = helpers.processTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.processTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> <b>";
  if (helper = helpers.processDesc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.processDesc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b></h2>\n					<i class=\"icon-misc-plus\" data-type=\"PROCESS\" title=\"";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n				</div>\n				<div class=\"stageContent\">\n					<div class=\"stageContentInner\">\n						<ul class=\"objectiveLabels objectiveRow group\">\n							<li>";
  if (helper = helpers.lblObjective) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblObjective); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblTargetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblTargetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblByWhen) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblByWhen); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblReviewRate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblReviewRate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n						</ul>\n						<ul id=\"processSortable\" class=\"sortable\"></ul>\n						<!-- <a href=\"#\" class=\"button addButton\" data-type=\"PROCESS\"><span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a> -->\n					</div>\n				</div>\n			</li>\n			<!-- Section 4 -->\n			<li class=\"objectiveStage\">\n				<div class=\"stageHeader last\">\n					<h2><span>";
  if (helper = helpers.staffTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.staffTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span> <b>";
  if (helper = helpers.staffDesc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.staffDesc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b></h2>\n					<i class=\"icon-misc-plus\" data-type=\"STAFF\" title=\"";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n				</div>\n				<div class=\"stageContent\">\n					<div class=\"stageContentInner\">\n						<ul class=\"objectiveLabels objectiveRow group\">\n							<li>";
  if (helper = helpers.lblObjective) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblObjective); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblTargetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblTargetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblByWhen) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblByWhen); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n							<li>";
  if (helper = helpers.lblReviewRate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblReviewRate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n						</ul>\n						<ul id=\"staffSortable\" class=\"sortable\"></ul>\n						<!-- <a href=\"#\" class=\"button addButton\" data-type=\"STAFF\"><span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.dialogConfirmAdd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmAdd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a> -->\n					</div>\n				</div>\n			</li>\n		</ul>\n	</article>\n	<script type=\"text/template\" id=\"objectiveDetailsDialog\">\n	  <ul id=\"objectiveFields\" class=\"group s1_formPanel dialogFields\">\n	    <li class=\"ocLabel\">";
  if (helper = helpers.addlblName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addlblName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n	    <li>\n	      <input name=\"objectiveName\" type=\"text\" id=\"objectiveName\" placeholder=\"";
  if (helper = helpers.addplhrObjective) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addplhrObjective); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n	    </li>\n	    <li class=\"ocLabel\">";
  if (helper = helpers.addlblReview) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addlblReview); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n	    <li>\n	      <select name=\"reviewFrequency\" id=\"reviewSelect\" class=\"select2\">\n	        <option value=\"WEEKLY\">";
  if (helper = helpers.addselectWeekly) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addselectWeekly); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n	        <option value=\"MONTHLY\">";
  if (helper = helpers.addselectMonthly) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addselectMonthly); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n	        <option value=\"QUARTERLY\">";
  if (helper = helpers.addselectQuarterly) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addselectQuarterly); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n	        <option value=\"ANNUALLY\">";
  if (helper = helpers.addselectAnnually) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addselectAnnually); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n	      </select>\n	    </li>\n		<li class=\"metrics\">\n		  <ul>\n		    <li>\n		      <ul class=\"metricLabels metricRow group\">\n		        <li>";
  if (helper = helpers.lblSummary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblSummary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n		        <li>";
  if (helper = helpers.lblSuccessIndicator) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblSuccessIndicator); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n		        <li>";
  if (helper = helpers.lblTargetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblTargetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n		        <li>";
  if (helper = helpers.lblByWhen) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblByWhen); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n		      </ul>\n		    </li>\n		    <!-- li.metricItem here -->\n		  </ul>\n		</li>\n\n	  </ul>\n	</script>\n</section>";
  return buffer;
  });
templates['forms/discussion/AddressProblems'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/address-problems/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"addressProblems\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"addressProblems\" name=\"addressProblems\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/Aspiration'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/your-ultimate-aspiration/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"ultimateAspiration\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"ultimateAspiration\" name=\"ultimateAspiration\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/BizModel'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/your-business-model/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"businessModelDescription\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"businessModelDescription\" name=\"businessModelDescription\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/Competitors'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/who-are-your-competitors/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"competitorsDescription\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"competitorsDescription\" name=\"competitorsDescription\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/Customers'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/describe-your-customers/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"customersDescription\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"customersDescription\" name=\"customersDescription\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/Expansion'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/expansion-options/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"expansionOptionsDescription\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"expansionOptionsDescription\" name=\"expansionOptionsDescription\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/KeyProblems'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>		\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/key-problems/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"keyProblems\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"keyProblems\" name=\"keyProblems\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/Management'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/management/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"management\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"management\" name=\"management\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/SalesAndMarketing'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/discussion/sales-and-marketing/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"salesAndMarketing\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"salesAndMarketing\" name=\"salesAndMarketing\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/discussion/StrategyStatement'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<div id=\"currentlyEditing\"></div>\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section id=\"f3\">\n	<article class=\"stratDiscussion\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/write-your-plan/strategy-statement/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<form class=\"s1_formPanel\">\n			<fieldset>				\n				<label for=\"mediumTermStrategicGoal\">";
  if (helper = helpers.instructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.instructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</label>\n				<div class=\"permissions\"></div>\n				<textarea id=\"mediumTermStrategicGoal\" name=\"mediumTermStrategicGoal\"></textarea> 				\n			</fieldset>\n		</form>\n	</article>\n</section>";
  return buffer;
  });
templates['forms/financials/AccountsPayableView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.ap_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ap_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"ap\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/options/accounts-payable/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n	    <div class=\"permissions\"></div>		\n\n		<h3>On average, how many days do you take to pay your suppliers?</h3>\n		<ul>\n			<li>If you pay cash on delivery for most of your supplies, enter \"0\" days</li>\n			<li>If you pay all your bills once a month, enter \"15\" days</li>\n			<li>If you consistently wait one month to pay your bills, enter\"30 days\"</li>\n			<li>If you pay at the time of order, and it takes 7 days to receive your suppies (pre-pay), enter \"-7\" days</li>\n		</ul>\n\n		<fieldset>\n			<div class=\"days\">&nbsp;</div>\n			<div id=\"slider\"></div>\n		</fieldset>\n\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['forms/financials/AccountsReceivableView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.ar_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ar_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"ar\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/options/accounts-receivable/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n	    <div class=\"permissions\"></div>\n\n		<h3>On average, how many days does it take your customers to pay you?</h3>\n		<ul>\n			<li>If all your customers pay you at the time of sale, enter \"0\" days</li>\n			<li>If your customers typically take one month to pay, enter \"30\" days</li>\n			<li>If your customers pre-pay when they place their order, and it takes you 7 days to process their order, enter \"-7\" days</li>\n		</ul>\n\n		<fieldset>\n			<div class=\"days\">&nbsp;</div>\n			<div id=\"slider\"></div>\n		</fieldset>\n\n	</article>\n</section>";
  return buffer;
  });
templates['forms/financials/AssetRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<a href=\"#\" class=\"icon-ui-remove deleteAsset\" title=\"";
  if (helper = helpers.dialogConfirmDeleteAsset) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmDeleteAsset); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n			";
  return buffer;
  }

  buffer += "<ul class=\"assetRow group\">\n	<li class=\"assetName\">\n\n	</li>\n	<li>\n		";
  if (helper = helpers.date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.depreciationTerm) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.depreciationTerm); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.salvageValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.salvageValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.depreciationType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.depreciationType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<nav>\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasWriteAccess), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</nav>\n	</li>\n</ul>";
  return buffer;
  });
templates['forms/financials/AssetsView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n  <hgroup>\n    <h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <h2>";
  if (helper = helpers.assets_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.assets_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n  </hgroup>\n</header>\n<section>\n  <article id=\"assets\" class=\"objectiveActivities\">\n    <div class=\"stratFileHelp\">\n      <iframe src=\"\" data-url=\"help/view-financials/options/assets/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\"></iframe>\n    </div>\n    <div class=\"permissions\"></div>\n    <h2>Describe any significant assets that your business currently has or will receive.</h2>\n    <div>Adding an asset will affect your Cash, Assets and Depreciation accounts on your Balance Sheet.</div>\n    <div class=\"stageContentInner\">\n      <ul class=\"assets assetRow group\">\n        <li>Name of Asset</li>\n        <li>Date Acquired</li>\n        <li>Value</li>\n        <li>Lifespan</li>\n        <li>Salvage Value</li>\n        <li>Type</li>\n        <li>Depreciation</li>\n      </ul>\n      <ul class=\"sortable ui-sortable\">\n        <!-- rows go here -->\n      </ul>\n      <a href=\"#\" class=\"button addButton\">\n      <span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.btnAddAsset) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnAddAsset); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </div>\n  </article>\n  <script type=\"text/template\" id=\"dialogEditAddAsset\">\n    <span class=\"instructions\">";
  if (helper = helpers.assetInstructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.assetInstructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <ul id=\"assetFields\" class=\"group s1_formPanel dialogFields\">\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAssetName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAssetName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"assetName\" type=\"text\" id=\"assetName\" placeholder=\"";
  if (helper = helpers.plhrAssetName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAssetName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"1\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAssetDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAssetDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <div class=\"datepickerWrapper\">\n          <i class=\"icon-ui-calendar-2\"></i>\n          <input id=\"assetDate\" type=\"text\" name=\"assetDate\" placeholder=\"";
  if (helper = helpers.plhrAssetDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAssetDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\" tabindex=\"2\" />\n        </div>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAssetType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAssetType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <select name=\"assetType\" id=\"assetType\" class=\"select2\" tabindex=\"3\">\n          <option value=\"LAND\">";
  if (helper = helpers.LAND) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.LAND); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"BUILDING\">";
  if (helper = helpers.BUILDING) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.BUILDING); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"MACHINERY\">";
  if (helper = helpers.MACHINERY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.MACHINERY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"FURNITURE\">";
  if (helper = helpers.FURNITURE) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.FURNITURE); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"TOOLS\">";
  if (helper = helpers.TOOLS) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.TOOLS); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"IT_EQUIPMENT\">";
  if (helper = helpers.IT_EQUIPMENT) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.IT_EQUIPMENT); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"VEHICLES\">";
  if (helper = helpers.VEHICLES) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.VEHICLES); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"OTHER\">";
  if (helper = helpers.OTHER) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.OTHER); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n        </select>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAssetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAssetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"assetValue\" type=\"number\" id=\"assetValue\" placeholder=\"";
  if (helper = helpers.plhrAssetValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAssetValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"4\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAssetSalvageValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAssetSalvageValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"assetSalvageValue\" type=\"number\" id=\"assetSalvageValue\" placeholder=\"";
  if (helper = helpers.plhrAssetSalvageValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAssetSalvageValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"5\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAssetDepreciationTerm) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAssetDepreciationTerm); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"assetDepreciationTerm\" type=\"number\" id=\"assetDepreciationTerm\" placeholder=\"";
  if (helper = helpers.plhrAssetDepreciationTerm) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAssetDepreciationTerm); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" max=\"999\" tabindex=\"6\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblAssetDepreciationType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAssetDepreciationType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"assetDepreciationType\" type=\"text\" id=\"assetDepreciationType\" placeholder=\"";
  if (helper = helpers.plhrAssetDepreciationType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAssetDepreciationType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" disabled readonly/>\n      </li>\n    </ul>\n  </script>\n</section>\n";
  return buffer;
  });
templates['forms/financials/EmployeeDeductionsView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.ed_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ed_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"employeeDeductions\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/options/employeeDeductions/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n	    <div class=\"permissions\"></div>		\n\n\n		<div class=\"section\">\n			<h3>What percentage of the expenses in each expense category are wages?</h3>\n			<fieldset>\n				<ul class=\"clean-list percentages\">\n					<li id=\"percentCogsAreWages\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>Cost of Goods Sold</label>\n	                    <span class=\"icon-ui-question important-info\" data-template-path=\"forms/financials/PercentageCogsWagesTip\"></span>\n						<div class=\"slider\" data-field=\"percentCogsAreWages\"></div>\n					</li>\n					<li id=\"percentGandAAreWages\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>General &amp; Administration</label>\n						<div class=\"slider\" data-field=\"percentGandAAreWages\"></div>\n					</li>\n					<li id=\"percentRandDAreWages\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>Research &amp; Development</label>\n						<div class=\"slider\" data-field=\"percentRandDAreWages\"></div>\n					</li>\n					<li id=\"percentSandMAreWages\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>Sales &amp; Marketing</label>\n						<div class=\"slider\" data-field=\"percentSandMAreWages\"></div>\n					</li>\n				</ul>\n			</fieldset>\n		</div>\n\n		<div class=\"section\">\n			<h3>On average, how much do you deduct from an employee's pay, as a percentage?</h3>\n			<fieldset>\n				<ul class=\"clean-list percentages\">\n					<li id=\"employeeContributionPercentage\">\n						<div class=\"value\">&nbsp;</div> 	\n						<label>Employee Contribution</label>							\n						<div class=\"slider\" data-field=\"employeeContributionPercentage\"></div>\n					</li>\n				</ul>\n			</fieldset>\n		</div>		\n\n		<div class=\"section due\">		\n			<h3>When are the deductions and remittances due?</h3>\n			<div>Choose either the end of the month in which the employees are paid (this month) OR the month after the employees are paid (next month).</div>\n			<fieldset>\n				<input type=\"radio\" name=\"dueDate\" value=\"THIS_MONTH\" disabled>This month\n				<input type=\"radio\" name=\"dueDate\" value=\"NEXT_MONTH\" disabled>Next month\n			</fieldset>\n		</div>\n\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['forms/financials/EquitiesView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n  <hgroup>\n    <h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <h2>";
  if (helper = helpers.equities_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.equities_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n  </hgroup>\n</header>\n<section>\n  <article id=\"equities\" class=\"objectiveActivities\">\n    <div class=\"stratFileHelp\">\n      <iframe src=\"\" data-url=\"help/view-financials/options/equities/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\"></iframe>\n    </div>\n    <div class=\"permissions\"></div>\n    <h3>Describe any equity investments that have been made (or that will be made) into your company.</h3>\n    <div>These will affect the Capital Stock and Cash accounts on your Balance Sheet.</div>\n    <div class=\"stageContentInner\">\n      <ul class=\"equities equityRow group\">\n        <li>Name of Investment</li>\n        <li>Date</li>\n        <li>Amount</li>\n      </ul>\n      <ul class=\"sortable ui-sortable\">\n        <!-- rows go here -->\n      </ul>\n      <a href=\"#\" class=\"button addButton \">\n      <span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.btnAddEquity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnAddEquity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </div>\n  </article>\n  <script type=\"text/template\" id=\"dialogEditAddEquity\">\n    <span class=\"instructions\">";
  if (helper = helpers.equityInstructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.equityInstructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <ul id=\"equityFields\" class=\"group s1_formPanel dialogFields\">\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblEquityName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblEquityName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"equityName\" type=\"text\" id=\"equityName\" placeholder=\"";
  if (helper = helpers.plhrEquityName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrEquityName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"1\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblEquityDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblEquityDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <div class=\"datepickerWrapper\">\n          <i class=\"icon-ui-calendar-2\"></i>\n          <input id=\"equityDate\" type=\"text\" name=\"equityDate\" placeholder=\"";
  if (helper = helpers.plhrEquityDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrEquityDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\" tabindex=\"2\" />\n        </div>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblEquityValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblEquityValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"equityValue\" type=\"number\" id=\"equityValue\" placeholder=\"";
  if (helper = helpers.plhrEquityValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrEquityValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"3\" />\n      </li>\n    </ul>\n  </script>\n\n</section>\n";
  return buffer;
  });
templates['forms/financials/EquityRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<a href=\"#\" class=\"icon-ui-remove deleteEquity\" title=\"";
  if (helper = helpers.dialogConfirmDeleteEquity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmDeleteEquity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n			";
  return buffer;
  }

  buffer += "<ul class=\"equityRow group\">\n	<li class=\"equityName\">\n\n	</li>\n	<li>\n		";
  if (helper = helpers.date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<nav>\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasWriteAccess), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</nav>\n	</li>\n</ul>";
  return buffer;
  });
templates['forms/financials/IncomeTaxView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.it_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.it_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"incomeTax\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/options/incomeTax/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n	    <div class=\"permissions\"></div>		\n\n		<div class=\"section\">\n			<h3>What income tax do you pay on your business' profits?</h3>\n			<fieldset>\n				<ul class=\"clean-list percentages\">\n					<li id=\"rate1\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>Rate on amounts up to: <span class=\"salaryLimit\" contenteditable=\"true\" data-key=\"salaryLimit1\">0</span></label>\n						<div class=\"slider\" data-field=\"rate1\"></div>\n					</li>\n					<li id=\"rate2\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>Rate on amounts up to: <span class=\"salaryLimit\" contenteditable=\"true\" data-key=\"salaryLimit2\">0</span></label>\n						<div class=\"slider\" data-field=\"rate2\"></div>\n					</li>\n					<li id=\"rate3\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>Rate on amounts over: <span class=\"salaryLimit\" data-key=\"salaryLimit2\">0</span></label>\n						<div class=\"slider\" data-field=\"rate3\"></div>\n					</li>\n				</ul>\n			</fieldset>\n		</div>\n\n		<div class=\"section\">\n			<h3>How many years can losses carry forward?</h3>\n			<fieldset>\n				<ul class=\"clean-list years\">\n					<li id=\"yearsCarryLossesForward\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>Years</label>\n						<div class=\"slider\" data-field=\"yearsCarryLossesForward\"></div>\n					</li>\n				</ul>\n			</fieldset>\n		</div>\n\n		<div class=\"section remittanceMonth\">		\n			<h3>In which month do you remit your income taxes?</h3>\n			<fieldset>\n		        <select name=\"remittanceMonth\" id=\"remittanceMonth\">\n		          <option value=\"0\">January</option>\n		          <option value=\"1\">February</option>\n		          <option value=\"2\">March</option>\n		          <option value=\"3\">April</option>\n		          <option value=\"4\">May</option>\n		          <option value=\"5\">June</option>\n		          <option value=\"6\">July</option>\n		          <option value=\"7\">August</option>\n		          <option value=\"8\">September</option>\n		          <option value=\"9\">October</option>\n		          <option value=\"10\">November</option>\n		          <option value=\"11\">December</option>\n		        </select>\n			</fieldset>\n		</div>\n\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['forms/financials/InventoryView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.inv_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.inv_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"inventory\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/options/inventory/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n	    <div class=\"permissions\"></div>		\n\n		<h3>What percentage of your Cost of Goods Sold relates to inventory?\n			<span class=\"icon-ui-question important-info\" data-template-path=\"forms/financials/PercentageCogsInventoryTip\"></span>\n		</h3>\n		<ul>\n			<li>If you don't sell inventory, enter \"0\".</li>\n		</ul>\n\n		<fieldset>\n			<div class=\"days\">&nbsp;</div>\n			<div id=\"percentCogsIsInventorySlider\"></div>\n		</fieldset>\n\n\n		<h3>How many days of lead-time do you require to replenish (order &amp; receive or build) your inventory?</h3>\n		<ul>\n			<li>If you're a manufacturer and it takes about 10 days to build your inventory of sale items, enter \"10\" days.</li>\n			<li>If you order your inventory from others and it takes about a month to receive it, enter \"30\" days.</li>\n			<li>If you don't carry inventory yourself (for example, perhaps you drop-ship it from another company's warehouse), enter \"0\" days.</li>\n		</ul>\n\n		<fieldset>\n			<div class=\"days\">&nbsp;</div>\n			<div id=\"inventoryLeadTimeSlider\"></div>\n		</fieldset>\n\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['forms/financials/LoanRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<a href=\"#\" class=\"icon-ui-remove deleteLoan\" title=\"";
  if (helper = helpers.dialogConfirmDeleteLoan) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmDeleteLoan); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n			";
  return buffer;
  }

  buffer += "<ul class=\"loanRow group\">\n	<li class=\"loanName\">\n\n	</li>\n	<li>\n		";
  if (helper = helpers.date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.amount) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.amount); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.term) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.term); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.rate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.frequency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.frequency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<nav>\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasWriteAccess), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</nav>\n	</li>\n</ul>";
  return buffer;
  });
templates['forms/financials/LoansView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n  <hgroup>\n    <h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <h2>";
  if (helper = helpers.loans_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.loans_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n  </hgroup>\n</header>\n<section>\n  <article id=\"loans\" class=\"objectiveActivities\">\n    <div class=\"stratFileHelp\">\n      <iframe src=\"\" data-url=\"help/view-financials/options/loans/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\"></iframe>\n    </div>\n    <div class=\"permissions\"></div>\n    <h3>Describe any loans that your business currently has or will receive.</h3>\n    <div>Loans will affect the Cash and Liabilities accounts in your Balance Sheet.</div>\n    <div class=\"stageContentInner\">\n      <ul class=\"loans loanRow group\">\n        <li>Name of Loan</li>\n        <li>Date Rcvd</li>\n        <li>Amount</li>\n        <li>Term</li>\n        <li>Rate</li>\n        <li>Type</li>\n        <li>Schedule</li>\n      </ul>\n      <ul class=\"sortable ui-sortable\">\n        <!-- rows go here -->\n      </ul>\n      <a href=\"#\" class=\"button addButton\">\n      <span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.btnAddLoan) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnAddLoan); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </div>\n  </article>\n  <script type=\"text/template\" id=\"dialogEditAddLoan\">\n    <span class=\"instructions\">";
  if (helper = helpers.loanInstructions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.loanInstructions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <ul id=\"loanFields\" class=\"group s1_formPanel dialogFields\">\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblLoanName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLoanName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"loanName\" type=\"text\" id=\"loanName\" placeholder=\"";
  if (helper = helpers.plhrLoanName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"1\"/>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblLoanDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLoanDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <div class=\"datepickerWrapper\">\n          <i class=\"icon-ui-calendar-2\"></i>\n          <input id=\"loanDate\" type=\"text\" name=\"loanDate\" placeholder=\"";
  if (helper = helpers.plhrLoanDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\" tabindex=\"2\" />\n        </div>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblLoanAmount) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLoanAmount); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"loanAmount\" type=\"number\" id=\"loanAmount\" placeholder=\"";
  if (helper = helpers.plhrLoanAmount) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanAmount); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"3\"/>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblLoanTerm) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLoanTerm); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"loanTermYears\" type=\"number\" id=\"loanTermYears\" placeholder=\"";
  if (helper = helpers.plhrLoanTermYears) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanTermYears); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" max=\"999\" tabindex=\"4\"/>\n        <input name=\"loanTermMonths\" type=\"number\" id=\"loanTermMonths\" placeholder=\"";
  if (helper = helpers.plhrLoanTermMonths) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanTermMonths); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" max=\"12\" tabindex=\"5\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblLoanRate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLoanRate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"loanRate\" type=\"text\" id=\"loanRate\" placeholder=\"";
  if (helper = helpers.plhrLoanRate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanRate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" max=\"100\" fixed=\"2\" tabindex=\"6\"/>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblLoanType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLoanType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <select name=\"loanType\" id=\"loanType\" class=\"select2\" placeholder=\"";
  if (helper = helpers.plhrLoanType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"7\">\n          <option value=\"PRINCIPAL_PLUS_INTEREST\">";
  if (helper = helpers.PRINCIPAL_PLUS_INTEREST) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.PRINCIPAL_PLUS_INTEREST); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"INTEREST_ONLY\">";
  if (helper = helpers.INTEREST_ONLY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.INTEREST_ONLY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n        </select>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblLoanFrequency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLoanFrequency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <select name=\"loanFrequency\" id=\"loanFrequency\" class=\"select2\" placeholder=\"";
  if (helper = helpers.plhrLoanFrequency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrLoanFrequency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"8\">\n          <option value=\"MONTHLY\">";
  if (helper = helpers.MONTHLY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.MONTHLY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"QUARTERLY\">";
  if (helper = helpers.QUARTERLY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.QUARTERLY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"ANNUALLY\">";
  if (helper = helpers.ANNUALLY) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ANNUALLY); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n        </select>\n      </li>\n    </ul>\n  </script>  \n</section>\n";
  return buffer;
  });
templates['forms/financials/OpeningBalancesView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.ob_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ob_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"openingBalances\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/options/opening-balances/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\"></iframe>\n		</div>\n\n	    <div class=\"permissions\"></div>\n		\n		<h3>Enter the opening balances for these accounts.</h3>\n		<div>These are the values on the day immediately prior to the start of this plan.</div>\n\n		<form>\n		  <fieldset>\n		    <ul>\n		      <li>\n		        <label for=\"cash\">";
  if (helper = helpers.lblCash) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblCash); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n		        <input id=\"cash\" data-field=\"cash\" type=\"number\" name=\"cash\" placeholder=\"";
  if (helper = helpers.plhrCash) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrCash); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" autofocus />\n		      </li>\n		      <li>\n		        <label for=\"ar\">";
  if (helper = helpers.lblAccountsReceivable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAccountsReceivable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n		        <input id=\"ar\" data-field=\"accountsReceivable\" type=\"number\" name=\"ar\" placeholder=\"";
  if (helper = helpers.plhrAccountsReceivable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAccountsReceivable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n		      </li>\n		      <li>\n		        <label for=\"ap\">";
  if (helper = helpers.lblAccountsPayable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblAccountsPayable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n		        <input id=\"ap\" data-field=\"accountsPayable\" type=\"number\" name=\"ap\" placeholder=\"";
  if (helper = helpers.plhrAccountsPayable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrAccountsPayable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n		      </li>\n  		      <li>\n		        <label for=\"retainedEarnings\">";
  if (helper = helpers.lblRetainedEarnings) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblRetainedEarnings); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n		        <div id=\"retainedEarnings\" class=\"displayInput\"></div>\n		      </li>\n		      <li>\n		        <label for=\"inventory\">";
  if (helper = helpers.lblInventory) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblInventory); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n		        <input id=\"inventory\" data-field=\"inventory\" type=\"number\" name=\"inventory\" placeholder=\"";
  if (helper = helpers.plhrInventory) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrInventory); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n		      </li>		      \n		      <li>\n		        <label for=\"salesTaxPayable\">";
  if (helper = helpers.lblSalesTaxPayable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblSalesTaxPayable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n		        <input id=\"salesTaxPayable\" data-field=\"salesTaxPayable\" type=\"number\" name=\"salesTaxPayable\" placeholder=\"";
  if (helper = helpers.plhrSalesTaxPayable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrSalesTaxPayable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n		      </li>		      \n		    </ul>\n		  </fieldset>\n		</form>\n\n	</article>\n</section>";
  return buffer;
  });
templates['forms/financials/PercentageCogsInventoryTip'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header>\n    <h4>Percentage COGS that is inventory</h4>\n</header>\n<article>\n    <p>The maximum percentage available is determined by the percentage entered for wages (under Employee Deductions). In other words, the percentage of COGS related to inventory and the percentage related to wages must total 100%.</p>\n</article>";
  });
templates['forms/financials/PercentageCogsWagesTip'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n    <h4>Percentage COGS that are wages</h4>\n</header>\n<article>\n    <p>The maximum percentage available is limited by the percentage entered for inventory (";
  if (helper = helpers.percentCogsIsInventory) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.percentCogsIsInventory); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "%). In other words, the percentage of COGS related to inventory and the percentage related to wages cannot exceed 100%.</p>\n</article>";
  return buffer;
  });
templates['forms/financials/SalesTaxView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.st_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.st_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n<section>\n	<article id=\"salesTax\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/options/salesTax/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n	    <div class=\"permissions\"></div>		\n\n		<div class=\"section\">\n			<h3>What percentage of your revenues do you charge sales tax on?</h3>\n			<fieldset>\n				<ul class=\"clean-list percentages\">\n					<li id=\"percentRevenuesIsTaxable\">\n						<div class=\"value\">&nbsp;</div> 			\n						<label>&nbsp;</label>\n						<div class=\"slider\" data-field=\"percentRevenuesIsTaxable\"></div>\n					</li>\n				</ul>\n			</fieldset>\n		</div>\n\n		<div class=\"section\">		\n			<h3>What is your sales tax rate?</h3>\n			<fieldset>\n				<input type=\"text\" id=\"salesTaxRate\" data-field=\"rate\" placeholder=\"";
  if (helper = helpers.plhrSalesTaxRate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrSalesTaxRate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" sp-max=\"100\" sp-fixed=\"3\" disabled>\n			</fieldset>\n		</div>\n\n		<div class=\"section remittanceFrequency\">		\n			<h3>How frequently do you remit the sales taxes you collect?</h3>\n			<fieldset>\n				<input type=\"radio\" name=\"remittanceFrequency\" value=\"MONTHLY\" disabled>Monthly\n				<input type=\"radio\" name=\"remittanceFrequency\" value=\"QUARTERLY\" disabled>Quarterly\n				<input type=\"radio\" name=\"remittanceFrequency\" value=\"ANNUALLY\" disabled>Annually\n			</fieldset>\n		</div>\n\n		<div class=\"section remittanceMonth\">		\n			<h3>In which month do you remit your sales taxes?</h3>\n			<fieldset>\n		        <select name=\"remittanceMonth\" id=\"remittanceMonth\">\n		          <option value=\"0\">January</option>\n		          <option value=\"1\">February</option>\n		          <option value=\"2\">March</option>\n		          <option value=\"3\">April</option>\n		          <option value=\"4\">May</option>\n		          <option value=\"5\">June</option>\n		          <option value=\"6\">July</option>\n		          <option value=\"7\">August</option>\n		          <option value=\"8\">September</option>\n		          <option value=\"9\">October</option>\n		          <option value=\"10\">November</option>\n		          <option value=\"11\">December</option>\n		        </select>\n			</fieldset>\n		</div>\n\n	</article>\n</section>\n\n\n\n";
  return buffer;
  });
templates['forms/themes/ProjectNoteItemList'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            ";
  if (helper = helpers.warn_readonly) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.warn_readonly); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "disabled=\"disabled\"";
  }

  buffer += "<aside class=\"notes-tooltip\">\n    <header>\n        <h4>";
  if (helper = helpers.notesHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n        <span>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </span>\n    </header>\n    <article class=\"group\">\n        <ul class=\"notesGrid notesHeader cleanList group\">\n            <li class=\"notesCategoryHeader\">\n                <!-- runtime -->\n            </li>\n            <li class=\"notesQuantityHeader\">\n                ";
  if (helper = helpers.notesQuantityHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesQuantityHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            </li>\n            <li class=\"notesPriceHeader\">\n                ";
  if (helper = helpers.notesPriceHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesPriceHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            </li>\n            <li class=\"notesTotalHeader\">\n                ";
  if (helper = helpers.notesRowTotalHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesRowTotalHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            </li>\n            <li class=\"notesStaffHeader\">\n                ";
  if (helper = helpers.notesStaffHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesStaffHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            </li>\n            <li class=\"notesCommentHeader\">\n                ";
  if (helper = helpers.notesCommentHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesCommentHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            </li>\n        </ul>\n\n        <ul id=\"projectNoteItems\" class=\"cleanList group\"></ul>\n\n        <ul class=\"notesGrid notesTotals cleanList group\">\n            <li class=\"notesTotalHeader\">\n                ";
  if (helper = helpers.notesTotalHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notesTotalHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n            </li>\n            <li class=\"notesTotal\">\n                <span id=\"notesTotal\"></span>\n            </li>\n        </ul>\n\n        <button id=\"closeNoteItem\" class=\"button orange\">";
  if (helper = helpers.doneNote) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.doneNote); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n        <button id=\"addNoteItem\" class=\"blue-btn\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  if (helper = helpers.addNote) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addNote); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n    </article>\n</aside>";
  return buffer;
  });
templates['forms/themes/ProjectNoteItemRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "disabled=\"disabled\"";
  }

function program3(depth0,data) {
  
  
  return "readonly=\"readonly\"";
  }

function program5(depth0,data) {
  
  
  return "\n            <i class=\"icon-new-times\"></i>\n        ";
  }

  buffer += "<ul class=\"notesGrid notesRow cleanList group\">\n    <li class=\"notesCategory\">\n        <select class=\"selectize\" data-key=\"category\" data-cat=\"";
  if (helper = helpers.category) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.category); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            <option selected=\"selected\" value=\"";
  if (helper = helpers.category) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.category); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.category) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.category); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n        </select>\n    </li>\n    <li class=\"notesQuantity\">\n        <input class=\"notesNumberInput\" type=\"number\" name=\"notesQuantity\" data-key=\"quantity\" value=\"";
  if (helper = helpers.quantity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.quantity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />\n    </li>\n    <li class=\"notesPrice\">\n        <input class=\"notesPrice\" type=\"number\" name=\"notesPrice\" data-key=\"price\" value=\"";
  if (helper = helpers.price) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.price); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />\n    </li>\n    <li class=\"notesRowTotal\">\n        <span class=\"nrTotal\">";
  if (helper = helpers.nrTotal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nrTotal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n    </li>\n    <li class=\"notesStaff\">\n        <input class=\"notesNumberInput\" type=\"number\" name=\"notesStaff\" data-key=\"nbOfStaff\" value=\"";
  if (helper = helpers.nbOfStaff) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nbOfStaff); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />\n    </li>\n    <li class=\"notesComment\">\n        <input class=\"notesNumberInput\" type=\"text\" name=\"notesComment\" title=\"";
  if (helper = helpers.comment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.comment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-key=\"comment\" value=\"";
  if (helper = helpers.comment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.comment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasWrite), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </li>\n</ul>";
  return buffer;
  });
templates['forms/themes/ProjectSeasonal'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            ";
  if (helper = helpers.warn_readonly) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.warn_readonly); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        ";
  return buffer;
  }

  buffer += "<aside class=\"seasonal-tooltip\">\n    <header>\n        <h4>";
  if (helper = helpers.seasonalHeader) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.seasonalHeader); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n        <span>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.readonly), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </span>\n    </header>\n    <article class=\"group\">\n\n        <div class=\"instructions\">If you expect financials to vary seasonally, indicate by how much below. For example, you might have a higher proportion of revenues during August and September, the typical back-to-school season, and a lower proportion in the winter months. Your proportions must total 100%.</div>\n\n        <div class=\"seasonalAdjustments\">\n            <fieldset>\n                <!-- eg -->\n                <div class=\"monthInput\">\n                    <div>Jan</div>\n                    <input id=\"janAdjustment\" class=\"seasonalAdjustment seasonal\" type=\"text\" name=\"janAdjustment\" maxlength=\"6\" />\n                </div>\n                <div class=\"monthInput\">\n                    <div>Feb</div>\n                    <input id=\"febAdjustment\" class=\"seasonalAdjustment seasonal\" type=\"text\" name=\"febAdjustment\" maxlength=\"6\" />\n                </div>\n                <!-- ... -->\n            </fieldset>\n\n            <div class=\"total\">\n                <div>Total</div>\n                <div id=\"seasonalAdjustmentTotal\" class=\"\" ></div>\n            </div>\n        </div>\n        \n        <div class=\"buttonBar\">\n            <button id=\"clearSeasonals\" class=\"blue-btn left\" title=\"Clear all adjustments.\">Clear</button>\n            <button id=\"defaultSeasonals\" class=\"blue-btn left\" title=\"Divide adjustments evenly across all fields.\">Defaults</button>\n            <button id=\"quarterlySeasonals\" class=\"blue-btn left\" title=\"Divide adjustments evenly across quarters.\">Quarterly</button>\n\n            <button id=\"doneSeasonalItem\" class=\"button orange\">";
  if (helper = helpers.btn_save) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btn_save); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n            <button id=\"cancelSeasonalItem\" class=\"grey-btn\">";
  if (helper = helpers.btn_cancel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btn_cancel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n        </div>\n\n    </article>\n</aside>";
  return buffer;
  });
templates['menu/ConnectStatus'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n  <p>You are Connected.</p>\n  <a id=\"goConnectReport\" href=\"#\">Click here to check your Connect activity.</a>\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isConnectNotStarted), {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "\n  <p>You do not have a Connect account.</p>\n  <p>Do you want small businesses looking for your products &amp; services to find you in StratPad?</p>\n  <a id=\"goConnect\" href=\"#\">Click here to create your Connect account.</a>\n  ";
  }

function program6(depth0,data) {
  
  var buffer = "";
  buffer += "\n    \n    <p>Your Connect account is incomplete.</p>\n    <a id=\"goConnectForm\" href=\"#\">Click here to finish signing up for Connect.</a>\n  ";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isConnectComplete), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
templates['menu/InfoMenuView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<b class=\"appversion\">StratPad Version ";
  if (helper = helpers.version) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.version); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b> <br /><br />\nBusiness planning made simple.<br /><br />\n<a href=\"#\" class=\"showWelcomeVideo icon-ui-movie\">Watch the Welcome Video</a><br /><br />\n<b>Designed and created by StratPad Inc.</b><br /><br />\nThe StratPad team is:<br />\nAlex Glassey<br />\nJulian Wood<br />\nSam Estok<br />\nManuela Bizzotto<br />\nVictor Chevalier<br /><br />\n<b>Privacy</b><br /><br />\nWe reserve the right to anonymously track your activity inside StratPad for the sole purpose of improving the software.<br /><br />\nTrademarks: StratPad, StratBoard, StratFile, StratCard, StratBak<br />\nCopyright © 2011-";
  if (helper = helpers.year) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.year); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " StratPad Inc.<br />\nAll rights reserved.<br /><br />\n<b>StratPad Inc.</b><br /><br />\n185-911 Yates Street<br />\nVictoria, BC Canada V8V 4Y9\n<p class=\"buildDetails\"><span>";
  if (helper = helpers.buildDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.buildDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><span>";
  if (helper = helpers.sha1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sha1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></p>";
  return buffer;
  });
templates['menu/PageMenubarView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- <li id=\"navFreeTrial\">\n	<span>";
  if (helper = helpers.trial3DayPrompt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.trial3DayPrompt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n</li>-->\n<li id=\"newStratfileParent\">\n	<button id=\"newStratfile\" title=\"";
  if (helper = helpers.tooltipNewPlan) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipNewPlan); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n		<i class=\"icon-misc-plus\"></i>";
  if (helper = helpers.btnNewPlan) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnNewPlan); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</button>\n</li>\n<li id=\"navStratFile\">\n	<span class=\"icon-new-list trigger tooltip\" title=\"";
  if (helper = helpers.tooltipStratFiles) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipStratFiles); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></span>\n	<div class=\"menu\"></div>\n</li>\n<li id=\"navShare\">\n	<span class=\"icon-social-share trigger tooltip\" title=\"";
  if (helper = helpers.tooltipShare) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipShare); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></span>\n	<div class=\"menu nano\"><div class=\"content\"></div></div>\n</li>\n<li id=\"navUser\">\n	<span class=\"icon-ui-user trigger tooltip\" title=\"";
  if (helper = helpers.tooltipProfile) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipProfile); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></span>\n	<div class=\"menu\"></div>\n</li>\n<li id=\"navSettings\">\n	<span class=\"icon-ui-cogs trigger tooltip\" title=\"";
  if (helper = helpers.tooltipSettings) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipSettings); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></span>\n	<div class=\"menu\"></div>\n</li>\n<li id=\"navInfo\">\n	<span class=\"icon-ui-info trigger tooltip\" title=\"";
  if (helper = helpers.tooltipAbout) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipAbout); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></span>\n	<div class=\"menu nano\"><div class=\"content\"></div></div>\n</li>";
  return buffer;
  });
templates['menu/ProfileMenuView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <h4></h4>\n    <article class=\"upgrade\">\n      <p>";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n      <a id=\"showUpgrade\" class=\"blue-btn\" href=\"#\">";
  if (helper = helpers.buttonText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.buttonText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </article>\n    ";
  return buffer;
  }

  buffer += "<div class=\"nano\">\n  <div class=\"content\">\n    <h4>Account</h4>\n    <article>\n      <figure id=\"profileDisplay\" class=\"group\">\n        <a href=\"http://www.gravatar.com\" target=\"_blank\">\n          <img src=\"https://secure.gravatar.com/avatar/";
  if (helper = helpers.md5) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.md5); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "?s=120\" />\n        </a>\n        <figcaption>\n        <b>";
  if (helper = helpers.firstname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.firstname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.lastname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lastname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>";
  if (helper = helpers.email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</figcaption>\n        <a id=\"editProfile\" href=\"#\" title=\"";
  if (helper = helpers.editProfile_tip) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.editProfile_tip); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.editProfile_btnName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.editProfile_btnName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a> •\n        <a id=\"changePassword\" href=\"#\" title=\"";
  if (helper = helpers.changePassword_tip) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_tip); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.changePassword_btnName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.changePassword_btnName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n      </figure>\n    </article>\n    <h4></h4>\n    <article class=\"versionDetails ";
  if (helper = helpers.className) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.className); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n      <span class=\"stratpadVersion\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n      <p id=\"planExpiry\">";
  if (helper = helpers.planExpiry) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.planExpiry); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n    </article>\n    <h4></h4>\n    <article class=\"connect\">\n      <span>StratPad Connect</span>\n      <p></p>\n    </article>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.showUpgrade), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
templates['menu/StratFileCellView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.isSampleFile), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<span class=\"icon-social-share\" title=\"";
  if (helper = helpers.sharedStratfile) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sharedStratfile); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></span>\n		";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		<a href=\"#\" class=\"icon-misc-lock\" title=\"";
  if (helper = helpers.lockedStratfile) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lockedStratfile); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n	";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n	<a href=\"#\" class=\"icon-ui-files copyStratfile\" title=\"";
  if (helper = helpers.tooltipCopyStratfile) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipCopyStratfile); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n	";
  return buffer;
  }

function program8(depth0,data) {
  
  
  return "disabled";
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n	<div class=\"unaccepted-stratfile\">\n		<div class=\"table\">\n			<div class=\"td\">\n				<span>";
  if (helper = helpers.pendingSharer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pendingSharer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><br />\n				";
  if (helper = helpers.pendingMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pendingMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			</div>\n		</div>\n	</div>\n";
  return buffer;
  }

  buffer += "<h6 class=\"stratFileName\"></h6>\n<span class=\"stratFileCompanyName\"></span>\n<time>";
  if (helper = helpers.date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</time>\n<nav>\n	";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.isOwner), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSampleFile), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.isShared), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	<a href=\"#\" class=\"icon-ui-remove deleteStratfile\" title=\"";
  if (helper = helpers.tooltipDeleteStratfile) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipDeleteStratfile); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSampleFile), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "></a>\n</nav>\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.unAcceptedShare), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  });
templates['menu/StratFileMenuView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<h4>";
  if (helper = helpers.navTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.navTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ":</h4>\n	<a id=\"importStratFile\" class=\"icon-ui-file-upload button tooltip\" href=\"#\" title=\"";
  if (helper = helpers.btnImportTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnImportTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><span><b>";
  if (helper = helpers.btnImport) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnImport); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b></span></a>\n	<a id=\"exportStratFile\" class=\"icon-ui-file button tooltip\" href=\"#\" title=\"";
  if (helper = helpers.btnExportTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnExportTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><span><b>";
  if (helper = helpers.btnExport) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnExport); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b></span></a>\n</header>\n<section id=\"stratFiles\" class=\"nano\"><div class=\"content\"></div></section>\n";
  return buffer;
  });
templates['menu/UpgradeMenuView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function";


  buffer += "<div id=\"new-pricing-table\">\n	<div class=\"header-text\">\n		<p class=\"main\"></p>\n	</div>\n	<ul class=\"price-table group\">\n		<li class=\"features\">\n			<ul class=\"pt-column first\">\n				<li class=\"col-first\"></li>\n				<li class=\"bg-darker\">\n					<div class=\"table\">\n						<div class=\"td\">";
  if (helper = helpers.rowNumberofPlans) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rowNumberofPlans); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n					</div>\n				</li>\n				<li class=\"feat-last bot-grey\">\n					<div class=\"table\">\n						<div class=\"td\">";
  if (helper = helpers.rowCanShare) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rowCanShare); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n					</div>\n				</li>\n			</ul>\n		</li>\n		<li class=\"free disabled\">\n			<ul class=\"pt-column border-left\">\n				<li class=\"col-first\">\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-type\">";
  if (helper = helpers.typeFree) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.typeFree); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n							<span class=\"product-cost\">";
  if (helper = helpers.priceFree) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.priceFree); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n							<span class=\"product-range\">";
  if (helper = helpers.forever) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.forever); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n						</div>\n					</div>\n				</li>\n				<li class=\"bg-darker\">\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-plans\">1</span>\n						</div>\n					</div>\n				</li>\n				<li>\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-check icon-misc-checkmark\"></span>\n						</div>\n					</div>\n				</li>				\n				<li class=\"col-last\">\n					<a id=\"buySkuStudent\" href=\"#\" data-product=\"com.stratpad.cloud.student\" class=\"product-purchase\">";
  if (helper = helpers.btnChoose) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnChoose); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n				</li>\n			</ul>\n		</li>\n		<li class=\"business popular\">\n			<ul class=\"pt-column\">\n				<li class=\"col-first\">\n					<span class=\"product-feature\">";
  if (helper = helpers.popular) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.popular); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-type middle\">";
  if (helper = helpers.typeBusiness) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.typeBusiness); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n<!-- 							\n							<span class=\"product-cost\">";
  if (helper = helpers.priceBusiness) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.priceBusiness); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n							<span class=\"product-range\">";
  if (helper = helpers.perYear) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.perYear); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span> -->\n							<button class=\"chooseBilling annual\" data-sku=\"com.stratpad.cloud.business\">\n							    <img id=\"save40\" src=\"images/Save36.png\"/>\n							    <div>\n							    <span class=\"price\">$8.25</span> <span class=\"currency\">USD/mo</span>\n							    <span class=\"billed\">billed annually</span>\n							    </div>\n							    <div class=\"radio product-check icon-misc-checkbox\">&nbsp;</div>\n							</button>\n							<div>or</div>\n							<button class=\"chooseBilling monthly\" data-sku=\"com.stratpad.cloud.business.monthly\">\n							    <div>\n							    <span class=\"price\">$12.95</span> <span class=\"currency\">USD/mo</span>\n							    <span class=\"billed\">billed monthly</span>\n							    </div>\n							    <div class=\"radio product-check icon-misc-checkbox-unchecked\">&nbsp;</div>\n							</button>							\n						</div>\n					</div>\n				</li>\n				<li>\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-plans\">5</span>\n						</div>\n					</div>\n				</li>\n				<li>\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-check icon-misc-checkmark\"></span>\n						</div>\n					</div>\n				</li>\n				<li class=\"pop-last\">\n					<a id=\"buySkuBusiness\" href=\"#\" data-sku=\"com.stratpad.cloud.business\" class=\"product-purchase\">";
  if (helper = helpers.btnChoose) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnChoose); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n				</li>\n			</ul>\n			<div class=\"popular-bg\"></div>\n		</li>\n		<li>\n			<ul class=\"pt-column last\">\n				<li class=\"col-first top-round\">\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-type middle\">";
  if (helper = helpers.typeUnlimited) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.typeUnlimited); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n<!-- 							<span class=\"product-cost\">";
  if (helper = helpers.priceUnlimited) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.priceUnlimited); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n							<span class=\"product-range\">";
  if (helper = helpers.perYear) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.perYear); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n -->					\n\n							<button class=\"chooseBilling annual\" data-sku=\"com.stratpad.cloud.unlimited\">\n							    <div>\n							    <span class=\"price\">$14.92</span> <span class=\"currency\">USD/mo</span>\n							    <span class=\"billed\">billed annually</span>\n							    </div>\n							    <div class=\"radio product-check icon-misc-checkbox\">&nbsp;</div>\n							</button>\n							<div>or</div>\n							<button class=\"chooseBilling monthly\" data-sku=\"com.stratpad.cloud.unlimited.monthly\">\n							    <div>\n							    <span class=\"price\">$19.95</span> <span class=\"currency\">USD/mo</span>\n							    <span class=\"billed\">billed monthly</span>\n							    </div>\n							    <div class=\"radio product-check icon-misc-checkbox-unchecked\">&nbsp;</div>\n							</button>							\n						</div>\n					</div>\n				</li>\n				<li class=\"bg-darker\">\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-plans\">";
  if (helper = helpers.typeUnlimited) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.typeUnlimited); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n						</div>\n					</div>\n				</li>\n				<li class=\"bot-grey bot-round\">\n					<div class=\"table\">\n						<div class=\"td\">\n							<span class=\"product-check icon-misc-checkmark\"></span>\n						</div>\n					</div>\n				</li>\n				<li class=\"col-last\">\n					<a id=\"buySkuUnlimited\" href=\"#\" data-sku=\"com.stratpad.cloud.unlimited\" class=\"product-purchase\">";
  if (helper = helpers.btnChoose) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnChoose); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n				</li>\n			</ul>\n		</li>\n	</ul>\n</div>\n";
  return buffer;
  });
templates['menu/share/AccessControlEntryRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<figure class=\"avatar\">\n	<a href=\"http://www.gravatar.com\" target=\"_blank\">\n		<img src=\"https://secure.gravatar.com/avatar/";
  if (helper = helpers.md5) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.md5); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "?s=120\" />\n	</a>\n</figure>\n<div class=\"user\">\n	<ul>\n		<li class=\"user-details\">\n			<span class=\"user-name\">";
  if (helper = helpers.invitee) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.invitee); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n			<span class=\"user-status\">(";
  if (helper = helpers.inviteeStatus) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.inviteeStatus); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")</span>\n			<a class=\"user-email\" href=\"mailto:";
  if (helper = helpers.userEmail) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.userEmail); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.userEmail) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.userEmail); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n		</li>\n		<li class=\"permission-details\">\n			";
  if (helper = helpers.inviteePermsStart) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.inviteePermsStart); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			<span class=\"access-level domain-plan al-invited\" data-type=\"PLAN\" data-permission=\"";
  if (helper = helpers.acePlanCurrentPermissions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.acePlanCurrentPermissions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n				<i>";
  if (helper = helpers.acePlanCurrent) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.acePlanCurrent); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</i>\n				<span class=\"permission-select\">\n					<b data-permission=\"WRITE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_edit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_edit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<b data-permission=\"READ\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_view) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_view); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<!-- <b data-permission=\"NONE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_none) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_none); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b> -->\n				</span>\n			</span>\n			";
  if (helper = helpers.inviteePermsMiddle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.inviteePermsMiddle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			<span class=\"access-level domain-stratboard al-invited\" data-type=\"STRATBOARD\" data-permission=\"";
  if (helper = helpers.aceStratboardCurrentPermissions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceStratboardCurrentPermissions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n				<i>";
  if (helper = helpers.aceStratBoardCurrent) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceStratBoardCurrent); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</i>\n				<span class=\"permission-select\">\n					<b data-permission=\"WRITE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_edit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_edit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<b data-permission=\"READ\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_view) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_view); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<b data-permission=\"NONE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_none) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_none); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n				</span>\n			</span>\n			";
  if (helper = helpers.inviteePermsEnd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.inviteePermsEnd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n		</li>\n	</ul>\n</div>\n\n<a href=\"#\" class=\"icon-ui-remove deleteUser\" title=\"";
  if (helper = helpers.tooltipDeleteStratfile) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipDeleteStratfile); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>";
  return buffer;
  });
templates['menu/share/ShareMenuInvitedView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.sharedWithYouTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sharedWithYouTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program3(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.readOnlyTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.readOnlyTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n	<h5>";
  if (helper = helpers.stratFileOwnerTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.stratFileOwnerTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h5>\n	<div class=\"user-entry root-user group\">\n		<figure class=\"avatar\">\n			<img src=\"https://secure.gravatar.com/avatar/";
  if (helper = helpers.md5) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.md5); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "?s=120\" />\n		</figure>\n		<div class=\"user\">\n			<ul class=\"clean-list\">\n				<li class=\"user-details\">\n					<span class=\"user-name\">";
  if (helper = helpers.aceOwnerName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceOwnerName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n					<span class=\"user-status\">(<a href=\"mailto:";
  if (helper = helpers.aceOwnerEmail) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceOwnerEmail); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.aceOwnerEmail) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceOwnerEmail); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>)</span>\n				</li>\n				<li class=\"permission-details\">";
  if (helper = helpers.aceOwnerMessage) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceOwnerMessage); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n			</ul>\n		</div>\n	</div>\n	";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n					<li class=\"permission-details\">";
  if (helper = helpers.sharedWithPermissions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sharedWithPermissions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n					<li class=\"permission-request\">";
  if (helper = helpers.sharedWithRequestChange) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sharedWithRequestChange); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n					<li class=\"permission-details\">";
  if (helper = helpers.readOnlyStratfile) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.readOnlyStratfile); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				";
  return buffer;
  }

  buffer += "<h4>";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.aceOwnerEmail)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h4>\n<article class=\"user-wrap\">\n	";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.aceOwnerEmail)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	<div class=\"user-entry root-user group\">\n		<div class=\"user invited\">\n			<ul class=\"clean-list\">\n				<li class=\"user-details\">\n				";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.aceOwnerEmail)),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				</li>\n			</ul>\n		</div>\n	</div>\n</article>\n";
  return buffer;
  });
templates['menu/share/ShareMenuOwnerView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h4 class=\"tooltip icon-ui-notification\" title=\"";
  if (helper = helpers.beta_notes) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.beta_notes); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><span class='beta_notes'>BETA: </span>";
  if (helper = helpers.menuTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.menuTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n<article class=\"invite-user\">\n	<div id=\"accessControlInviteControls\">\n		<input type=\"email\" id=\"accessControlInvite\" name=\"accessControlInvite\" placeholder=\"";
  if (helper = helpers.plhdr_accessControlInvite) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhdr_accessControlInvite); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n		<div class=\"inviteButtonWrap\">\n			<a id=\"sendAceInvite\" class=\"blue-btn\" href=\"#\">";
  if (helper = helpers.btn_invite) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btn_invite); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n			<span id=\"shareSpinner\"></span>\n		</div>\n		<div class=\"permission-details\">\n			";
  if (helper = helpers.invitePermsStart) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.invitePermsStart); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			<span class=\"access-level al-invite domain-plan\" data-permission=\"WRITE\" data-type=\"PLAN\">\n				<i>";
  if (helper = helpers.aceSelect_edit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_edit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</i>\n				<span class=\"permission-select\">\n					<b data-permission=\"WRITE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_edit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_edit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<b data-permission=\"READ\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_view) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_view); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<!-- <b data-permission=\"NONE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_none) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_none); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b> -->\n				</span>\n			</span>\n			";
  if (helper = helpers.invitePermsMiddle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.invitePermsMiddle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			<span class=\"access-level al-invite domain-stratboard\" data-permission=\"WRITE\" data-type=\"STRATBOARD\">\n				<i>";
  if (helper = helpers.aceSelect_edit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_edit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</i>\n				<span class=\"permission-select\">\n					<b data-permission=\"WRITE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_edit) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_edit); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<b data-permission=\"READ\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_view) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_view); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n					<b data-permission=\"NONE\" class=\"permission-type\">";
  if (helper = helpers.aceSelect_none) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceSelect_none); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</b>\n				</span>\n			</span>\n			";
  if (helper = helpers.invitePermsEnd) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.invitePermsEnd); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n		</div>\n	</div>\n</article>\n<article class=\"user-wrap\">\n	<h5>";
  if (helper = helpers.haveAccessTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.haveAccessTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h5>\n	<div class=\"user-entry root-user group\">\n		<figure class=\"avatar\">\n			<a href=\"http://www.gravatar.com\" target=\"_blank\">\n				<img src=\"https://secure.gravatar.com/avatar/";
  if (helper = helpers.md5) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.md5); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "?s=120\" />\n			</a>\n		</figure>\n		<div class=\"user\">\n			<ul class=\"clean-list\">\n				<li class=\"user-details\">\n					<span class=\"user-name\">";
  if (helper = helpers.fullName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fullName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n					<span class=\"user-status\">(";
  if (helper = helpers.ownerStatus) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ownerStatus); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ")</span>\n				</li>\n				<li class=\"permission-details\">";
  if (helper = helpers.aceOwnerPermissions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.aceOwnerPermissions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n			</ul>\n		</div>\n	</div>\n	<ul id=\"accessControlEntries\" class=\"clean-list\"></ul>\n</article>\n\n";
  return buffer;
  });
templates['navbar/ActivitiesNavCellView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span data-key=\"";
  if (helper = helpers.pageref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pageref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" model=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  if (helper = helpers.summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n";
  return buffer;
  });
templates['navbar/ChartNavCellView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span data-key=\"";
  if (helper = helpers.pageref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pageref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" model=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></span>\n";
  return buffer;
  });
templates['navbar/ObjectivesNavCellView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span data-key=\"";
  if (helper = helpers.pageref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pageref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" model=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n";
  return buffer;
  });
templates['navbar/ThemeCellView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<span data-key=\"";
  if (helper = helpers.pageref) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.pageref); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" model=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n";
  return buffer;
  });
templates['pagetoolbar/PageToolbarView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<ul id=\"pageToolbar\">\n	<!-- from right to left -->\n	<li id=\"showHelp\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showHelp) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showHelp); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-misc-question-sign\"></span>\n		</a>\n	</li>\n    <li id=\"showCommunityAgreement\">\n        <a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showCommunityAgreement) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showCommunityAgreement); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n            <span class=\"icon-new-handshake\"></span>\n        </a>\n    </li>\n	<li id=\"suggestCategory\" class=\"serviceProviders\">\n		<a href=\"#\">\n			<span class=\"text\">";
  if (helper = helpers.suggestCategory) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.suggestCategory); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n		</a>\n	</li>\n	<li id=\"referFriend\" class=\"serviceProviders\">\n		<a href=\"#\">\n			<span class=\"text earn\">";
  if (helper = helpers.earn5) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.earn5); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><br><span class=\"text refer\">";
  if (helper = helpers.referFriend) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.referFriend); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>			\n		</a>\n	</li>\n    <li id=\"linkToMyAccount\" class=\"serviceProviders\">\n        <a href=\"#\">\n            <span class=\"text\"></span>\n        </a>\n    </li>  \n	<li id=\"showGuide\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showHideGuide) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showHideGuide); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-ui-compass\"></span>\n		</a>\n	</li>\n	<li id=\"deleteProject\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.deleteProject) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.deleteProject); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-ui-file-remove\"></span>\n		</a>\n	</li>\n	<li id=\"cloneProject\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.cloneProject) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cloneProject); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-ui-files\"></span>\n		</a>\n	</li>\n    <li id=\"addProject\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.addProject) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addProject); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-ui-file-plus\"></span>\n		</a>\n	</li>\n    <li id=\"showNavigator\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showNavigator) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showNavigator); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-new-paragraph-left\"></span>\n		</a>\n	</li>		\n	<li id=\"showExportDialog\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showExportDialog) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showExportDialog); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-ui-file-download\"></span>\n		</a>\n	</li>\n	<li id=\"showEmailDialog\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showEmailDialog) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showEmailDialog); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-ui-envelop\"></span>\n		</a>\n	</li>\n	<li id=\"showPrintPopup\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showPrintPopup) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showPrintPopup); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-ui-print\"></span>\n		</a>\n	</li>\n	<li id=\"showChartControl\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.showChartControls) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.showChartControls); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-new-tools\"></span>\n		</a>\n	</li>\n	<li id=\"newChart\">\n		<a href=\"#\" class=\"tooltip\" title=\"";
  if (helper = helpers.addNewChart) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.addNewChart); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n			<span class=\"icon-misc-plus\"></span>\n		</a>\n	</li>\n	<li id=\"connectProgressBar\" class=\"tooltip\" title=\"";
  if (helper = helpers.connectProgressBar) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.connectProgressBar); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n		<div class=\"progressWell\"></div>\n		<div class=\"progress\"></div>\n		<div class=\"progressLabel\">";
  if (helper = helpers.connectProgressLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.connectProgressLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n	</li>\n</ul>";
  return buffer;
  });
templates['pagetoolbar/ProjectGuideView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"guidePage1\" class=\"guidePage active\" data-index=\"1\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<p>";
  if (helper = helpers.page1Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page1Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<ul class=\"guideSelector cleanList l-grid l-col-50\">\n				<li>\n					<div class=\"selectGuide\">\n						<h2>";
  if (helper = helpers.page1GuidedTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1GuidedTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n						<p>";
  if (helper = helpers.page1GuidedDesc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1GuidedDesc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n						<button id=\"startGuidedTour\" class=\"blue-btn\">";
  if (helper = helpers.page1GuidedLink) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1GuidedLink); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n					</div>\n				</li>\n				<li>\n					<div class=\"selectGuide\">\n						<h2>";
  if (helper = helpers.page1ExpertTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1ExpertTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n						<p>";
  if (helper = helpers.page1ExpertDesc) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1ExpertDesc); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n						<button id=\"goExpertProject\" class=\"button orange\">";
  if (helper = helpers.page1ExpertLink) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1ExpertLink); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n					</div>\n				</li>\n			</ul>\n			<p><label><input type=\"checkbox\" class=\"continueGuide\" /> ";
  if (helper = helpers.page1ContinueGuide) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page1ContinueGuide); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label></p>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage2\" class=\"guidePage\" data-index=\"2\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<p>";
  if (helper = helpers.page2Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page2Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p><strong>";
  if (helper = helpers.page2Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page2Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong></p>\n			<div class=\"table-wrap\">\n				<img class=\"project-guide-table\" src=\"/images/project-guide-table-1.png\" alt=\"\" />\n			</div>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage3\" class=\"guidePage\" data-index=\"3\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<p>";
  if (helper = helpers.page3Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page3Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p><strong>";
  if (helper = helpers.page3Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page3Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong></p>\n			<div class=\"table-wrap\">\n				<img class=\"project-guide-table\" src=\"/images/project-guide-table-2.png\" alt=\"\" />\n			</div>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage4\" class=\"guidePage\" data-index=\"4\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<p>";
  if (helper = helpers.page4Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page4Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p><strong>";
  if (helper = helpers.page4Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page4Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong></p>\n			<div class=\"table-wrap\">\n				<img class=\"project-guide-table\" src=\"/images/project-guide-table-3.png\" alt=\"\" />\n			</div>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage5\" class=\"guidePage hasThemeData\" data-index=\"5\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<p>";
  if (helper = helpers.page5Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page5Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<fieldset>\n				<label for=\"guide_name\">";
  if (helper = helpers.page5ProjectNameLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page5ProjectNameLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<input id=\"guide_name\" type=\"text\" name=\"guide_name\" class=\"fullWidth guide_genericInput\" tabindex=\"91\" placeholder=\"eg. Get to Market\"/>\n			</fieldset>\n			<fieldset>\n				<label for=\"guide_startDate\">";
  if (helper = helpers.page5ProjectStartLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page5ProjectStartLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"datepickerWrapper\">\n					<i class=\"icon-ui-calendar-2\"></i>\n					<input id=\"guide_startDate\" type=\"text\" name=\"guide_startDate\" class=\"datepicker fullWidth\" tabindex=\"92\"/>\n				</div>\n			</fieldset>\n			<fieldset>\n				<label for=\"guide_endDate\">";
  if (helper = helpers.page5ProjectEndLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page5ProjectEndLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<div class=\"datepickerWrapper\">\n					<i class=\"icon-ui-calendar-2\"></i>\n					<input id=\"guide_endDate\" type=\"text\" name=\"guide_endDate\" class=\"datepicker fullWidth\" tabindex=\"93\"/>\n				</div>\n			</fieldset>\n			<fieldset>\n				<label for=\"guide_responsible\">";
  if (helper = helpers.page5ProjectResponsibleLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page5ProjectResponsibleLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n				<input type='hidden' name=\"guide_responsible\" id=\"guide_responsible\" class=\"select2 fullWidth\" tabindex=\"94\" />\n			</fieldset>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage6\" class=\"guidePage\" data-index=\"6\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<p>";
  if (helper = helpers.page6Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page6Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page6Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page6Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page6Paragraph3) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page6Paragraph3); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<ul>\n				<li>";
  if (helper = helpers.page6ListItem1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page6ListItem1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.page6ListItem2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page6ListItem2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.page6ListItem3) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page6ListItem3); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n				<li>";
  if (helper = helpers.page6ListItem4) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page6ListItem4); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n			</ul>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage7\" class=\"guidePage hasThemeData\" data-index=\"7\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<h2>";
  if (helper = helpers.page7Heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7Heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n            <p class=\"warnNotes\">";
  if (helper = helpers.page7_10NotesWarn) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7_10NotesWarn); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page7Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page7Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<ul class=\"inputList cleanList l-grid l-col-33\">\n				<li>\n					<h4>";
  if (helper = helpers.page7rdHeading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7rdHeading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<p>";
  if (helper = helpers.page7rdExample) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7rdExample); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n					<input id=\"guide_researchAndDevelopmentOneTime\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_researchAndDevelopmentOneTime\" tabindex=\"95\" placeholder=\"eg. 10000\"/>\n				</li>\n				<li>\n					<h4>";
  if (helper = helpers.page7smHeading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7smHeading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<p>";
  if (helper = helpers.page7smExample) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7smExample); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n					<input id=\"guide_salesAndMarketingOneTime\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_salesAndMarketingOneTime\" tabindex=\"96\" placeholder=\"eg. 5000\"/>\n				</li>\n				<li>\n					<h4>";
  if (helper = helpers.page7gaHeading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7gaHeading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<p>";
  if (helper = helpers.page7gaExample) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7gaExample); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n					<input id=\"guide_generalAndAdminOneTime\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_generalAndAdminOneTime\" tabindex=\"97\" placeholder=\"eg. 1000\"/>\n				</li>\n			</ul>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage8\" class=\"guidePage hasThemeData\" data-index=\"8\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<h2>";
  if (helper = helpers.page8Heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page8Heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n            <p class=\"warnNotes\">";
  if (helper = helpers.page7_10NotesWarn) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7_10NotesWarn); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page8Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page8Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n			<ul class=\"inputList cleanList l-grid l-col-33\">\n				<li>\n					<h4>";
  if (helper = helpers.page8rdLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page8rdLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<input id=\"guide_researchAndDevelopmentMonthly\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_researchAndDevelopmentMonthly\" tabindex=\"98\" placeholder=\"eg. 200\"/>\n				</li>\n				<li>\n					<h4>";
  if (helper = helpers.page8smLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page8smLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<input id=\"guide_salesAndMarketingMonthly\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_salesAndMarketingMonthly\" tabindex=\"99\" placeholder=\"eg. 1000\"/>\n				</li>\n				<li>\n					<h4>";
  if (helper = helpers.page8gaLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page8gaLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<input id=\"guide_generalAndAdminMonthly\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_generalAndAdminMonthly\" tabindex=\"910\" placeholder=\"eg. 300\"/>\n				</li>\n			</ul>\n			<p>";
  if (helper = helpers.page8Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page8Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<ul class=\"inputList cleanList l-grid l-col-33\">\n				<li>\n					<input id=\"guide_researchAndDevelopmentMonthlyAdjustment\" class=\"guide_themeFinAdjustment\" type=\"number\" name=\"guide_researchAndDevelopmentMonthlyAdjustment\" tabindex=\"911\" placeholder=\"eg. 5.0\"/>\n				</li>\n				<li>\n					<input id=\"guide_salesAndMarketingMonthlyAdjustment\" class=\"guide_themeFinAdjustment\" type=\"number\" name=\"guide_salesAndMarketingMonthlyAdjustment\" tabindex=\"912\" placeholder=\"eg 2.5\"/>\n				</li>\n				<li>\n					<input id=\"guide_generalAndAdminMonthlyAdjustment\" class=\"guide_themeFinAdjustment\" type=\"number\" name=\"guide_generalAndAdminMonthlyAdjustment\" tabindex=\"913\" placeholder=\"eg. 1.0\"/>\n				</li>\n			</ul>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage9\" class=\"guidePage hasThemeData\" data-index=\"9\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<h2>";
  if (helper = helpers.page9Heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page9Heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n            <p class=\"warnNotes\">";
  if (helper = helpers.page7_10NotesWarn) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7_10NotesWarn); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page9Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page9Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<input id=\"guide_revenueOneTime\" class=\"fixedInput guide_themeFinChanges\" type=\"number\" name=\"guide_revenueOneTime\" tabindex=\"914\" placeholder=\"eg. 10000\"/>\n			<p>";
  if (helper = helpers.page9Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page9Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<input id=\"guide_cogsOneTime\" class=\"fixedInput guide_themeFinChanges\" type=\"number\" name=\"guide_cogsOneTime\" tabindex=\"915\" placeholder=\"eg. 10000\"/>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage10\" class=\"guidePage hasThemeData\" data-index=\"10\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<h2>";
  if (helper = helpers.page10Heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10Heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n            <p class=\"warnNotes\">";
  if (helper = helpers.page7_10NotesWarn) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page7_10NotesWarn); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page10Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<ul class=\"inputList cleanList l-grid l-col-33\">\n				<li>\n					<h4>";
  if (helper = helpers.page10FirstMonthRevenueLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10FirstMonthRevenueLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<input id=\"guide_revenueMonthly\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_revenueMonthly\" tabindex=\"916\" placeholder=\"eg. 100000\"/>\n				</li>\n				<li class=\"group\">\n					<h4>";
  if (helper = helpers.page10FirstMonthRevenueIncDecLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10FirstMonthRevenueIncDecLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<input id=\"guide_revenueMonthlyAdjustment\" class=\"inputRight guide_themeFinAdjustment\" type=\"number\" name=\"guide_revenueMonthlyAdjustment\" tabindex=\"917\" placeholder=\"eg. 5.0\"/>\n				</li>\n				<li></li>\n			</ul>\n			<p>";
  if (helper = helpers.page10Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<ul class=\"inputList cleanList l-grid l-col-33\">\n				<li>\n					<h4>";
  if (helper = helpers.page10FirstMonthCogsLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10FirstMonthCogsLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<input id=\"guide_cogsMonthly\" class=\"fullWidth guide_themeFinChanges\" type=\"number\" name=\"guide_cogsMonthly\" tabindex=\"918\" placeholder=\"eg. 40000\"/>\n				</li>\n				<li class=\"group\">\n					<h4>";
  if (helper = helpers.page10FirstMonthCogsIncDecLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10FirstMonthCogsIncDecLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n					<input id=\"guide_cogsMonthlyAdjustment\" class=\"inputRight guide_themeFinAdjustment\" type=\"number\" name=\"guide_cogsMonthlyAdjustment\" tabindex=\"919\" placeholder=\"eg. 8.0\"/>\n				</li>\n				<li></li>\n			</ul>\n			<p>";
  if (helper = helpers.page10Paragraph3) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page10Paragraph3); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n		</div>\n	</div>\n</div>\n\n<div id=\"guidePage11\" class=\"guidePage\" data-index=\"11\">\n	<div class=\"contentWrap\">\n		<div class=\"gContent\">\n			<h2>";
  if (helper = helpers.page11Heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page11Heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n			<p>";
  if (helper = helpers.page11Paragraph1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page11Paragraph1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<p>";
  if (helper = helpers.page11Paragraph2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page11Paragraph2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n			<div class=\"finishedGuide\">\n				<a id=\"addAnotherProject\" href=\"#\">";
  if (helper = helpers.page11AddAnother) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page11AddAnother); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n				<label><input type=\"checkbox\" class=\"continueGuide\" /> ";
  if (helper = helpers.page11ContinueGuide) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.page11ContinueGuide); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n			</div>\n		</div>\n	</div>\n</div>";
  return buffer;
  });
templates['reports/BalanceSheetDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading_details) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading_details); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article id=\"balanceSheetDetail\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/balance-sheet-monthly/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<div class=\"reportWrapper\">		\n			<div class=\"headerWrapper\">\n				<table id=\"tableRowHeaders\" class=\"tableRowHeaders\">\n					<thead>\n						<tr class=\"rowDivider2\">\n							<th>&nbsp;</th>\n						</tr>\n					</thead>\n					<tbody></tbody>\n				</table>\n			</div>\n			<div class=\"tableWrapper\">\n				<table id=\"fullReportTable\" class=\"fullReportTable\">\n					<thead></thead>\n					<tbody></tbody>\n				</table>\n			</div>\n			<div id=\"disclaimer\">\n				";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			</div>			\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/BalanceSheetSummary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading_summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading_summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article id=\"balanceSheetSummary\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/balance-sheet-1-page/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table class=\"reportTable\">\n			<thead>\n			</thead>\n			<tbody>\n			</tbody>\n			<tfoot><tr><td id=\"disclaimer\" colspan=\"15\">";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td></tr></tfoot>\n		</table>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/BizPlanPageWrapperForDocx'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!DOCTYPE html>\n<html>\n  <head>\n    <link rel=\"stylesheet\" href=\"";
  if (helper = helpers.baseUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.baseUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/css/style.css\" type=\"text/css\" />\n    <link rel=\"stylesheet\" href=\"";
  if (helper = helpers.baseUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.baseUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/css/phantom.css\" type=\"text/css\" />\n  </head>\n  <body>\n    ";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </body>\n</html>\n";
  return buffer;
  });
templates['reports/CashFlowDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading_details) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading_details); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article id=\"cashFlowDetail\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/statement-cash-flows-monthly/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<div class=\"reportWrapper\">		\n			<div class=\"headerWrapper\">\n				<table id=\"tableRowHeaders\" class=\"tableRowHeaders\">\n					<thead>\n						<tr class=\"rowDivider2\">\n							<th>&nbsp;</th>\n						</tr>\n					</thead>\n					<tbody></tbody>\n				</table>\n			</div>\n			<div class=\"tableWrapper\">\n				<table id=\"fullReportTable\" class=\"fullReportTable\">\n					<thead></thead>\n					<tbody></tbody>\n				</table>\n			</div>\n			<div id=\"disclaimer\">\n				";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			</div>			\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/CashFlowSummary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading_summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading_summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article id=\"cashFlowSummary\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/statement-cash-flows-1-page/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table class=\"reportTable\">\n			<thead>\n			</thead>\n			<tbody>\n			</tbody>\n			<tfoot><tr><td id=\"disclaimer\" colspan=\"15\">";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td></tr></tfoot>\n		</table>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/IncomeStatementDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading_details) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading_details); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article id=\"incomeStatementDetail\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/income-statement-monthly/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<div class=\"reportWrapper\">		\n			<div class=\"headerWrapper\">\n				<table id=\"tableRowHeaders\" class=\"tableRowHeaders\">\n					<thead>\n						<!-- empty cell at top of row headers -->\n						<tr class=\"rowDivider2\">\n							<th>&nbsp;</th>\n						</tr>\n					</thead>\n					<tbody>\n						<!-- eg a single content row; must be entirely replaced.\n\n						<tr>\n							<td class=\"rowLevel1\">Net Changes from Operations</td>\n						</tr>\n						-->\n					</tbody>\n				</table>\n			</div>\n			<div class=\"tableWrapper\">\n				<table id=\"fullReportTable\" class=\"fullReportTable\">\n					<thead>\n						<!-- \n							- column headers in content section\n							- predicated on 8*12 + 1 columns = a fixed width for the table content \n							- must be entirely replaced\n\n						<tr class=\"rowDivider2\">\n							<th>&nbsp;</th>\n							<td>Jan 2012</td>\n							<td>Feb 2012</td>\n							<td>Mar 2012</td>\n							<td>Apr 2012</td>\n							<td>May 2012</td>\n							<td>...</td>\n						</tr>\n						-->\n					</thead>\n					<tbody>\n						<!-- \n							- must also have 8*12+1 columns \n							- # rows must match # rows in #tableRowHeaders \n							- we repeat the row header in order to ascertain the cell height\n							- must be entirely replaced\n						\n						<tr>\n							<td class=\"rowLevel1\">Net Changes from Operations</td>\n							<td>-999,999,999</td>\n							<td>-999,999,999</td>\n							<td>-999,999,999</td>\n							<td>10,000</td>\n							<td>10,000</td>\n							<td>10,000</td>\n						</tr>\n						-->\n					</tbody>\n				</table>\n			</div>\n			<div id=\"disclaimer\">\n				";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			</div>\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/IncomeStatementSummary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading_summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading_summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article id=\"incomeStatementSummary\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/income-statement-1-page/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table class=\"reportTable\">\n			<thead>\n			</thead>\n			<tbody>\n			</tbody>\n			<tfoot><tr><td id=\"disclaimer\" colspan=\"15\">";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td></tr></tfoot>\n		</table>	\n	</article>\n</section>";
  return buffer;
  });
templates['reports/Playbook'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n	</hgroup>\n</header>\n\n<section id=\"playbook\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/playbook/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div id=\"toc\">\n\n			<h3>Your Business Playbook includes:</h3>\n\n			<blockquote>\n				<ul>\n				 <li>Who We Are\n				 	<ul>\n				 		<li>What We Aspire To</li>\n				 		<li>What We Are Focused On</li>\n				 	</ul>\n				 </li>\n				 <li>What We Need to Do In The Next Six Months</li>\n				 <li>Things We Need To Watch THIS MONTH</li>\n				 <li>Things We Need To Be Aware Of NEXT MONTH</li>\n				 <li>Key Financial Numbers from Last Month and for the Next Six Months That We Need to Watch</li>\n				 <li>Our Revenue Assumptions and Projections from Last Month and for the Next Six Months</li>\n				 <li>Our Cost of Goods Assumptions and Projections from Last Month and for the Next Six Months</li>\n				 <li>Our Expense Projections from Last Month and for the Next Six Months</li>\n				 <li>Our Cash Projections from Last Month and for the Next Six Months</li>\n				 <li>Our Staffing Assumptions from Last Month and the Next Six Months</li>\n				</ul>\n			</blockquote>\n\n		</div>\n		<div id=\"download\">\n			<h3>Starting month:</h3>\n\n	        <div class=\"datepickerWrapper\">\n	          <i class=\"icon-ui-calendar-2\"></i>\n	          <input id=\"startDate\" type=\"text\" name=\"startDate\" placeholder=\"\" class=\"datepicker\" tabindex=\"1\" />\n	        </div>\n\n			<button id=\"downloadPlaybookPdf\">Create Business Playbook as a PDF</button>\n			<div id=\"status\"><span></span></div>\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/PlaybookPdf'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<article>\n    <div class=\"section dynamicSubcontext titlepage\">\n      <div class=\"company\">";
  if (helper = helpers.company) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.company); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n      <div class=\"title\">Business Playbook</div class=\"title\">\n      <div class=\"date\">";
  if (helper = helpers.startDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.startDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n    </div>\n\n    <div class=\"section\">\n      <h2>Who We Are</h2>\n      <p>";
  if (helper = helpers.companyBasics) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.companyBasics); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n\n      <h4>What We Aspire To</h4>\n      <p>";
  if (helper = helpers.ultimateAspiration) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ultimateAspiration); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n\n      <h4>What We Are Focused On</h4>\n      <p>";
  if (helper = helpers.mediumTermStrategicGoal) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.mediumTermStrategicGoal); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n    </div>\n\n    <div class=\"section\">\n      <h2>What We Need to Do In The Next Six Months</h2>\n\n      ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.gantt)),stack1 == null || stack1 === false ? stack1 : stack1.$el)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.outerHTML)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    <div class=\"section\">\n      <h2>Things We Need To Watch THIS MONTH</h2>\n\n      ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.playbookAgendaThisMonth)),stack1 == null || stack1 === false ? stack1 : stack1.$el)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.outerHTML)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    <div class=\"section\">\n      <h2>Things We Need To Be Aware Of NEXT MONTH</h2>\n\n      ";
  stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.playbookAgendaNextMonth)),stack1 == null || stack1 === false ? stack1 : stack1.$el)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.outerHTML)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    <div class=\"section compress\">\n      <h2>Key Financial Numbers from Last Month and for the Next Six Months That We Need to Watch</h2>\n\n      <div>";
  stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.income)),stack1 == null || stack1 === false ? stack1 : stack1.$el)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.outerHTML)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n    </div>\n\n     <div class=\"section compress\">\n      <h2>Our Revenue Assumptions and Projections from Last Month and for the Next Six Months</h2>\n\n      ";
  if (helper = helpers.worksheetRevenue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.worksheetRevenue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n   \n     <div class=\"section compress\">\n      <h2>Our Cost of Goods Assumptions and Projections from Last Month and for the Next Six Months</h2>\n\n      ";
  if (helper = helpers.worksheetCOGS) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.worksheetCOGS); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n     <div class=\"section compress\">\n      <h2>Our Expense Projections from Last Month and for the Next Six Months</h2>\n\n      ";
  if (helper = helpers.worksheetExpenses) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.worksheetExpenses); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    <div class=\"section compress\">\n      <h2>Our Cash Projections from Last Month and for the Next Six Months</h2>\n\n      <div>";
  stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.cashflow)),stack1 == null || stack1 === false ? stack1 : stack1.$el)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.outerHTML)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n    </div>    \n\n    <div class=\"section compress\">\n      <h2>Our Staffing Assumptions from Last Month and the Next Six Months</h2>\n\n      ";
  if (helper = helpers.worksheetStaffComplement) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.worksheetStaffComplement); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n\n</article>\n";
  return buffer;
  });
templates['reports/R1.StrategyMap'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n	</hgroup>\n</header>\n\n<section id=\"r1\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/strategy-map/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<div id=\"strategyMap\">\n			\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R12.BizPlan'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n	</hgroup>\n</header>\n\n<section id=\"r12\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/business-plan/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n\n		<div id=\"toc\">\n\n			<h3>Your business plan includes:</h3>\n\n			<blockquote>\n			<h4>Business Plan</h4>\n			<ul>\n			 <li>Introduction</li>\n			 <li>The Sector We Operate In and How We Make Money\n			 	<ul>\n				 <li>Target Customers</li> \n				 <li>Key Industry Issues</li> \n				 <li>Our Solution</li> \n				 <li>Competition</li> \n				 <li>Business Model</li> \n				 <li>Additional Opportunities</li> \n				</ul>\n			 </li>\n			 <li>Project Plan, Summarized</li>\n			 <li>Key Metrics</li>\n			 <li>Operational Financial Performance, Summarized</li>\n			</ul>\n			 \n			<h4>Appendices</h4>\n			<ol>\n			<li>Summary Financial Projections</li>\n			<li>Income Statement Projections, By Month</li>\n			<li>Statement of Cash Flows Projections, By Month</li>\n			<li>Balance Sheet Projections, By Month</li>\n			<li>Worksheet, By Month</li>\n			<!-- <li>Ratios, By Month</li> -->\n			<!-- <li>Schedules, By Month</li> -->\n			<li>Project Plan</li>\n			<li>Gantt Chart</li>\n			<li>Theme Detail</li>\n			<!-- <li>Team Profiles</li> -->\n			<ol>\n			</blockquote>\n\n		</div>\n		<div id=\"download\">\n			<h3>Download now:</h3>\n			<button id=\"downloadBizPlanDocx\">Create Full Business Plan as DocX</button>\n			<div id=\"status\"><span></span></div>\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R2.StrategyByMonth'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>&nbsp;</h2>\n	</hgroup>\n</header>\n\n<section id=\"r2\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/projections-monthly-overall/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table id=\"strategyByMonth\" class=\"reportTable col-15\">\n			<thead></thead>\n			<tbody></tbody>\n			<caption id=\"disclaimer\">";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</caption>\n		</table>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R3.StrategyByTheme'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>&nbsp;</h2>\n	</hgroup>\n</header>\n\n<section id=\"r3\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/projections-project-summary/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<!-- can scroll -->\n		<div class=\"reportWrapper\">\n			<table id=\"strategyByTheme\" class=\"reportTable\">\n				<thead></thead>\n				<tbody></tbody>\n				<caption id=\"disclaimer\">";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</caption>\n			</table>\n		</div>\n	</article>\n</section>\n";
  return buffer;
  });
templates['reports/R4.ThemeByMonth'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>&nbsp;</h2>\n	</hgroup>\n</header>\n\n<section id=\"r4\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/projections-monthly-project/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table id=\"themeByMonth\" class=\"reportTable col-15\">\n			<thead></thead>\n			<tbody></tbody>\n			<caption id=\"disclaimer\">";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</caption>\n		</table>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R5.ThemeDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>&nbsp;</h2>\n	</hgroup>\n</header>\n\n<section id=\"r5\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/project-detail/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table id=\"themeDetailReport\" class=\"reportTable\">\n			<thead>\n				<tr class=\"colHeader1\">\n					<th><span>";
  if (helper = helpers.r5_objectives) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_objectives); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></th>\n					<th colspan=\"3\"><span>";
  if (helper = helpers.r5_scorecard) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_scorecard); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></th>\n					<th colspan=\"4\"><span>";
  if (helper = helpers.r5_activity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_activity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></th>\n				</tr>\n				<tr class=\"rowDivider5\">\n					<td class=\"showMe\">&nbsp;</td>\n					<td>";
  if (helper = helpers.r5_measure) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_measure); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n					<td class=\"target\">";
  if (helper = helpers.r5_target) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_target); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n					<td>";
  if (helper = helpers.r5_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n					<td>";
  if (helper = helpers.r5_action) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_action); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n					<td class=\"activityCost\">";
  if (helper = helpers.r5_firstYearCost) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_firstYearCost); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n					<td>";
  if (helper = helpers.r5_start) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_start); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n					<td>";
  if (helper = helpers.r5_end) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r5_end); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n				</tr>\n			</thead>\n			<tbody></tbody>\n			<tfoot><tr><td colspan=\"7\" class=\"responsible\"></td></tr></tfoot>\n		</table>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R6.Gantt'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n	</hgroup>\n</header>\n\n<section id=\"r6\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/gantt-chart/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table id=\"gantt\" class=\"reportTable\">\n			<thead>\n				<tr class=\"colHeader1\">\n				</tr>\n			</thead>\n			<tbody>\n			</tbody>\n		</table>		\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R7.ProjectPlan'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>&nbsp;</h2>\n	</hgroup>\n</header>\n\n<section id=\"r7\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/project-plan/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<table id=\"projectPlanReport\" class=\"reportTable\">\n			<thead>\n				<tr class=\"rowDivider5\">\n					<th>";
  if (helper = helpers.r7_theme) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r7_theme); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n					<th>";
  if (helper = helpers.r7_startDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r7_startDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n					<th>";
  if (helper = helpers.r7_endDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.r7_endDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</th>\n				</tr>\n			</thead>\n			<tbody>\n			</tbody>\n		</table>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R8.Agenda'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>&nbsp;</h2>\n	</hgroup>\n</header>\n\n<section id=\"r8\">\n	<article id=\"agendaReport\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/agendas/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/R9.BizPlanSummary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n	</hgroup>\n</header>\n\n<section id=\"r9\">\n	<article class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-reports/summary-business-plan/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<div id=\"sectiona\"><h4>";
  if (helper = helpers.R9_SECTION_A_HEADING) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.R9_SECTION_A_HEADING); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4></div>\n		<div id=\"sectionb\"><h4>";
  if (helper = helpers.R9_SECTION_B_HEADING) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.R9_SECTION_B_HEADING); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4></div>\n		<div id=\"sectionc\">\n			<h4>";
  if (helper = helpers.R9_SECTION_C_HEADING) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.R9_SECTION_C_HEADING); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n			<table id=\"gantt\" class=\"reportTable\">\n				<thead>\n					<tr class=\"colHeader1\">\n					</tr>\n				</thead>\n				<tbody>\n				</tbody>\n			</table>			\n		</div>\n		<div id=\"sectiond\">\n			<h4>";
  if (helper = helpers.R9_SECTION_D_HEADING) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.R9_SECTION_D_HEADING); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n			<table id=\"goals\" class=\"reportTable\">\n				<thead>\n					<tr class=\"colHeader1\">\n					</tr>\n				</thead>\n				<tbody>\n				</tbody>\n			</table>			\n		</div>\n		<div id=\"sectione\">\n			<h4>";
  if (helper = helpers.R9_SECTION_E_HEADING) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.R9_SECTION_E_HEADING); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n			<table id=\"progress\" class=\"reportTable\">\n				<thead>\n					<tr class=\"colHeader1\">\n					</tr>\n				</thead>\n				<tbody>\n				</tbody>\n			</table>			\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/WorksheetDetail'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading_details) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading_details); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article id=\"worksheetDetail\" class=\"group fullWidth\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/view-financials/worksheetdetail/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<div class=\"reportWrapper\">		\n			<div class=\"headerWrapper\">\n				<table id=\"tableRowHeaders\" class=\"tableRowHeaders\">\n					<thead>\n						<!-- empty cell at top of row headers -->\n						<tr class=\"rowDivider2\">\n							<th>&nbsp;</th>\n						</tr>\n					</thead>\n					<tbody>\n						<!-- eg a single content row; must be entirely replaced.\n\n						<tr>\n							<td class=\"rowLevel1\">Net Changes from Operations</td>\n						</tr>\n						-->\n					</tbody>\n				</table>\n			</div>\n			<div class=\"tableWrapper\">\n				<table id=\"fullReportTable\" class=\"fullReportTable\">\n					<thead>\n						<!-- \n							- column headers in content section\n							- predicated on 8*12 + 1 columns = a fixed width for the table content \n							- must be entirely replaced\n\n						<tr class=\"rowDivider2\">\n							<th>&nbsp;</th>\n							<td>Jan 2012</td>\n							<td>Feb 2012</td>\n							<td>Mar 2012</td>\n							<td>Apr 2012</td>\n							<td>May 2012</td>\n							<td>...</td>\n						</tr>\n						-->\n					</thead>\n					<tbody>\n						<!-- \n							- must also have 8*12+1 columns \n							- # rows must match # rows in #tableRowHeaders \n							- we repeat the row header in order to ascertain the cell height\n							- must be entirely replaced\n						\n						<tr>\n							<td class=\"rowLevel1\">Net Changes from Operations</td>\n							<td>-999,999,999</td>\n							<td>-999,999,999</td>\n							<td>-999,999,999</td>\n							<td>10,000</td>\n							<td>10,000</td>\n							<td>10,000</td>\n						</tr>\n						-->\n					</tbody>\n				</table>\n			</div>\n			<div id=\"disclaimer\">\n				";
  if (helper = helpers.fs_disclaimer) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fs_disclaimer); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			</div>			\n		</div>\n	</article>\n</section>";
  return buffer;
  });
templates['reports/princePDF'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!DOCTYPE html>\n<html>\n  <head>\n    <title>";
  if (helper = helpers.documentTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.documentTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</title>\n    <link rel=\"stylesheet\" href=\"";
  if (helper = helpers.mainCss) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.mainCss); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text/css\" />\n    <link rel=\"stylesheet\" href=\"";
  if (helper = helpers.princeCss) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.princeCss); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text/css\" />\n  </head>\n  <body class=\"";
  if (helper = helpers.bodyClass) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bodyClass); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n      <div id=\"reportName\">";
  if (helper = helpers.reportName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.reportName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n      <div id=\"stratfile\">";
  if (helper = helpers.stratFileName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.stratFileName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n      <div id=\"date\">";
  if (helper = helpers.now) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.now); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n      <div id=\"company\">";
  if (helper = helpers.company) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.company); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n	  ";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <script>\n          Prince.addScriptFunc(\"subcontext\", function(n) {\n              return document.getElementById('subcontext'+n).textContent;\n          });\n          Prince.addScriptFunc(\"footer\", function(company, pagenum) {\n              var sprintf = function() {\n                  var s = arguments[0];\n                  for (var i=1, ct=arguments.length; i<ct; i++) {\n                      s = s.replace('%s', arguments[i]);\n                  }\n                  return s;\n              }            \n              if (company) {\n                return sprintf('";
  if (helper = helpers.reportFooterFormatWithCompany) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.reportFooterFormatWithCompany); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "', company, pagenum)\n              }\n              else {\n                return sprintf('";
  if (helper = helpers.reportFooterFormat) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.reportFooterFormat); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "', pagenum)\n              }\n          });\n      </script>\n  </body>\n</html>\n";
  return buffer;
  });
templates['stratboard/ChartControlView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<aside id=\"chartControlDrawer\">\n\n	<input name=\"chartTitle\" type=\"text\" id=\"chartTitle\" placeholder=\"";
  if (helper = helpers.plhrChartTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrChartTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"/>\n\n    <select name=\"chartType\" id=\"chartType\" class=\"select2\" tabindex=\"2\">\n      <option value=\"1\">";
  if (helper = helpers.LINE) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.LINE); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n      <option value=\"2\">";
  if (helper = helpers.BAR) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.BAR); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n      <option value=\"3\">";
  if (helper = helpers.AREA) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.AREA); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n    </select>\n\n	<input type=\"checkbox\" id=\"toggleTarget\"><label for=\"toggleTarget\">";
  if (helper = helpers.lblTarget) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblTarget); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n\n	<input type=\"checkbox\" id=\"toggleTrendLine\"><label for=\"toggleTrendLine\">";
  if (helper = helpers.lblTrendline) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblTrendline); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n\n	<input type=\"text\" name=\"chartColor\" id=\"chartColor\" placeholder=\"";
  if (helper = helpers.plhrChartColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrChartColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n\n	<button id=\"btnMeasurements\">";
  if (helper = helpers.btnMeasurements) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnMeasurements); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n\n  <div class=\"permissions\"></div>\n\n  <script type=\"text/template\" id=\"dialogManageMeasurements\">\n    <article id=\"measurements\" class=\"objectiveActivities\">\n      <div>";
  if (helper = helpers.dialogManageMeasurementsLblMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogManageMeasurementsLblMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  if (helper = helpers.sourceName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sourceName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n      <div class=\"stageContentInner\">\n        <ul class=\"measurements measurementRow group\">\n          <li>Date</li>\n          <li>Value</li>\n          <li>Comment</li>\n        </ul>\n        <ul class=\"sortable ui-sortable\">\n          <!-- rows go here -->\n        </ul>\n        <a href=\"#\" class=\"button addButton\">\n        <span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.btnAddMeasurement) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnAddMeasurement); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n        <a href=\"#\" class=\"button linkQboButton\">\n        <span class=\"icon-ui-link-2\"></span>";
  if (helper = helpers.btnLinkToQBO) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnLinkToQBO); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n      </div>\n    </article>\n  </script>\n\n\n  <script type=\"text/template\" id=\"dialogEditAddMeasurement\">\n    <ul id=\"measurementFields\" class=\"group s1_formPanel dialogFields\">\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblMeasurementValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblMeasurementValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"measurementValue\" id=\"measurementValue\" placeholder=\"";
  if (helper = helpers.plhrMeasurementValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrMeasurementValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"1\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblMeasurementDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblMeasurementDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <div class=\"datepickerWrapper\">\n          <i class=\"icon-ui-calendar-2\"></i>\n          <input id=\"measurementDate\" type=\"text\" name=\"measurementDate\" placeholder=\"";
  if (helper = helpers.plhrMeasurementDate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrMeasurementDate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"datepicker\" tabindex=\"2\" />\n        </div>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblMeasurementComment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblMeasurementComment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"measurementComment\" type=\"text\" id=\"measurementComment\" placeholder=\"";
  if (helper = helpers.plhrMeasurementComment) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrMeasurementComment); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"3\" />\n      </li>\n    </ul>\n  </script>\n\n\n</aside>";
  return buffer;
  });
templates['stratboard/ChartPage'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<hgroup>\n		<h1>";
  if (helper = helpers.heading) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.heading); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>	\n		<h2>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n	</hgroup>\n</header>\n\n<section>\n	<article class=\"group fullWidth chart\">\n		<div class=\"stratFileHelp\">\n			<iframe src=\"\" data-url=\"help/track-progress/chart/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n		</div>\n		<svg></svg>\n	</article>\n</section>";
  return buffer;
  });
templates['stratboard/ChartRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<button class=\"icon-new-tools blue-btn tooltip\" title=\"";
  if (helper = helpers.tooltipEditChart) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipEditChart); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></button>\n			<button class=\"icon-ui-remove deleteChart button orange tooltip\" title=\"";
  if (helper = helpers.tooltipDeleteChart) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipDeleteChart); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></button>\n			";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<img src=\"/images/qbo-logo.png\" class=\"tooltip qbo-chart-logo\" title=\"";
  if (helper = helpers.tooltipQBO) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipQBO); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n		";
  return buffer;
  }

  buffer += "<ul class=\"chartRow group\">\n	<li>\n		";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n		<div title=\"";
  if (helper = helpers.subtext1Hint) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtext1Hint); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.subtext1) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtext1); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		<div title=\"";
  if (helper = helpers.subtext2Hint) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtext2Hint); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.subtext2) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subtext2); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		<nav>\n			<button class=\"icon-new-expand blue-btn tooltip\" title=\"";
  if (helper = helpers.tooltipViewChart) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tooltipViewChart); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></button>\n			";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasWriteAccess), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</nav>\n	</li>\n	<li>\n		";
  if (helper = helpers.firstValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.firstValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</li>\n	<li>\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isQBOChart), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<svg></svg>\n	</li>\n	<li>\n		";
  if (helper = helpers.lastValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lastValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</li>\n	<li>\n		";
  if (helper = helpers.onTarget) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.onTarget); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</li>\n</ul>\n";
  return buffer;
  });
templates['stratboard/MeasurementRowView'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<ul class=\"measurementRow group\">\n	<li>\n		";
  if (helper = helpers.date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n	</li>\n	<li>\n		";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</li>\n	<li>\n		";
  stack1 = (helper = helpers.displayProp || (depth0 && depth0.displayProp),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.measurement), "comment", options) : helperMissing.call(depth0, "displayProp", (depth0 && depth0.measurement), "comment", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		<nav>\n			<a href=\"#\" class=\"icon-ui-remove deleteMeasurement\" title=\"";
  if (helper = helpers.dialogConfirmDeleteMeasurement) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dialogConfirmDeleteMeasurement); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></a>\n		</nav>\n	</li>\n</ul>";
  return buffer;
  });
templates['stratboard/StratBoardSummary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n  <hgroup>\n    <h1>";
  if (helper = helpers.charts_title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.charts_title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <h2>&#160;</h2>\n  </hgroup>\n</header>\n<section>\n  <article id=\"charts\" class=\"objectiveActivities\">\n    <div class=\"stratFileHelp\">\n      <iframe src=\"\" data-url=\"help/track-progress/summary/?iframe=1\" width=\"100%\" height=\"90%\" frameborder=\"0\" webkitallowfullscreen=\"\" mozallowfullscreen=\"\" allowfullscreen=\"\"></iframe>\n    </div>\n    <div class=\"permissions\"></div>\n    <div class=\"stageContentInner\">\n      <ul class=\"chartHeader chartRow group\">\n        <li><span>Name</span></li>\n        <li><span>First Value</span></li>\n        <li class=\"monthYearHeader\"></li>\n        <li><span>Last Value</span></li>\n        <li><span>On Target?</span></li>\n      </ul>\n      <ul class=\"sortable ui-sortable\">\n        <!-- rows go here -->\n      </ul>\n      <a href=\"#\" class=\"button orange addButton\">\n      <span class=\"icon-ui-file-plus\"></span>";
  if (helper = helpers.btnAddChart) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.btnAddChart); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </div>\n  </article>\n  <script type=\"text/template\" id=\"dialogEditAddChart\">\n    <ul id=\"chartFields\" class=\"group s1_formPanel dialogFields\">\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblChartMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblChartMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"chartMetric\" id=\"chartMetric\" type=\"hidden\" placeholder=\"";
  if (helper = helpers.plhrChartMetric) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrChartMetric); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"select2\" tabindex=\"1\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblChartTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblChartTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input name=\"chartTitle\" type=\"text\" id=\"chartTitle\" placeholder=\"";
  if (helper = helpers.plhrChartTitle) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrChartTitle); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"2\" />\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblChartType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblChartType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <select name=\"chartType\" id=\"chartType\" class=\"select2\" tabindex=\"3\">\n          <option value=\"1\">";
  if (helper = helpers.LINE) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.LINE); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"2\">";
  if (helper = helpers.BAR) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.BAR); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n          <option value=\"3\">";
  if (helper = helpers.AREA) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.AREA); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n        </select>\n      </li>\n      <li class=\"ocLabel\">";
  if (helper = helpers.lblChartColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblChartColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li>\n        <input type=\"text\" name=\"chartColor\" id=\"chartColor\" placeholder=\"";
  if (helper = helpers.plhrChartColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plhrChartColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"4\" />\n      </li>\n      <li class=\"ocLabel linkToQBO\">";
  if (helper = helpers.lblLinkToQBO) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblLinkToQBO); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li class=\"linkToQBO\">\n        <label><input type=\"checkbox\" name=\"linkToQBO\" id=\"linkToQBO\" tabindex=\"5\" /> <span>";
  if (helper = helpers.msgUseManualValues) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.msgUseManualValues); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></label>\n      </li>\n\n    </ul>\n  </script>\n</section>\n";
  return buffer;
  });
})();