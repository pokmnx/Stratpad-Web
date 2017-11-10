This is the Python version of the REST services for StratWeb on GAE. It has been superceded by jstratpad, deployed on GAE.

A simple full loop:

signup:
	curl -X POST -i -d '{ "signUpEmail" : "julian@stratpad.com", "signUpName" : "Julian Wood", "signUpPassword" : "asdasd", "confirmPassword" : "asdasd" }' http://localhost:8081/signup

signin:
	curl -X POST -i -d 'signInEmail=julian@stratpad.com&signInPassword=asdasd&remember=n' http://localhost:8081/login

create stratfile:
	curl -X POST -i -d '{ "stratfileName": "Testing", "city" : "Sunnyvale" }' --header 'Cookie: auth=[...]; Max-Age=1814400; Path=/; expires=Fri, 05-Apr-2013 07:35:48 GMT'  --header 'Origin: http://localhost' http://localhost:8081/stratfile	

get stratfile:
	// doesn't seem to need the Origin header, for a GET, but doesn't hurt it either
	curl -i --header 'Cookie: auth=[...]' http://localhost:8081/stratfile/6554989257637756928

modify stratfile
	// Origin seems optional here too
	curl -X POST -i -d '{ "stratfileName": "New name", "city" : "Calgary" }' --header 'Cookie: auth=[...]''  --header 'Origin: http://localhost' http://localhost:8081/stratfile/6554989257637756928	

delete stratfile
	// Origin is optional, or it has been cached when we created
	curl -X DELETE -i --header 'Cookie: auth="...' http://localhost:8081/stratfile/6554989257637756928

Stratfiles are related to the user by id, but remember there is no cascade.
Themes are children of Stratfiles, so there should be a cascade. Themes are related to users through their parent stratfile.
In general, the URL is /theme/stratfileid/themeid

add theme: /theme/[stratfileid]
	curl -X POST -i -d '{ "themeName": "Test theme", "mandatory" : 1 }' --header 'Cookie: auth="[...]' --header 'Origin: http://localhost' http://localhost:8081/theme/5188146770730811392

modify theme: /theme/[stratfileid]/[themeid]
	curl -X PUT -i -d '{ "responsible": "Julian", "mandatory" : 0, "startDate":"1984-11-05" }' --header 'Cookie: auth="[...]' --header 'Origin: http://localhost' http://localhost:8081/theme/5188146770730811392/6341068275337658368

get theme: /theme/[stratfileid]/[themeid]
	curl -i --header 'Cookie: auth="...' --header 'Origin: http://localhost' http://localhost:8081/theme/5188146770730811392/6341068275337658368

delete theme: /theme/[stratfileid]/[themeid]
	curl -X DELETE -i --header 'Cookie: auth="...' --header 'Origin: http://localhost' http://localhost:8081/theme/5188146770730811392/6341068275337658368

get themes: /themes/[stratfileid]
	curl -i --header 'Cookie: auth="...' --header 'Origin: http://localhost' http://localhost:8081/themes/5188146770730811392