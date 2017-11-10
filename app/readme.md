This app is a client-side javascript app which uses a REST service built on GAE.
Client-side, the fundamental technologies are backbone.js, require.js, jquery and handlebars templating.

The trickiest thing always is dealing with CORS. Remember that as soon as we issue a non-GET AJAX request with a non-normal content-type, we are going to get a preflight request asking for permission.

curl -H "Origin: https://stratpad.site44.com"   -H "Access-Control-Request-Method: POST"   -H "Access-Control-Request-Headers: X-Requested-With"   -X OPTIONS --verbose   https://jstratpad.appspot.com/reports/balancesheet/summary?uuid=27A6780F-5069-46D9-8FC9-1DF99B7504E7&dateModified=14444188

Server needs to return something like:

< HTTP/1.1 200 OK
< Cache-Control: no-cache
< Accept-Ranges: bytes
< Access-Control-Allow-Headers: X-Requested-With
< Access-Control-Allow-Methods: DELETE,GET,OPTIONS,POST,PUT
< Access-Control-Max-Age: 1728000
< Access-Control-Allow-Credentials: true
< Access-Control-Allow-Origin: https://stratpad.site44.com
< Date: Sat, 15 Jun 2013 01:15:32 GMT
< Content-Type: text/html
< Server: Google Frontend
< Content-Length: 0

Right now, we have all the REST services running on GAE (jstratpad), and they are suitable for app development. They are in java and written by Victor Chevalier.

To run the app, just fire up a python server and load index.html, after doing an ant build.

python -m SimpleHTTPServer

To deploy the app, you need to send all the static files to a static web server (was staging.stratpad.com, but trying to move it all to GAE).

Build requirements:
jdk
ant
ruby - for compass
compass - http://compass-style.org/install/
brew - for handlebars - http://handlebarsjs.com/precompilation.html
node - for handlebars - can take several minutes!!
npm - for handlebars
handlebars - for templates

sudo npm install handlebars@1.3.0 -g
sudo gem install compass -v 1.0.3

for REST tests:
phantomjs (ant) or browser
webserver that can handle posts eg python -m CGIHTTPServer 8000
then would need python 2.7.2
jstratpad must be running on GAE, or some other server (see config.js)

for deployment:
http://www.jcraft.com/jsch/index.html ant plugin

**************
admin scripts:
**************

// note staging is jstratpad.appspot.com

// login as root (passwords in application.properties)
curl -X POST -H "Content-Type: application/json" -d '{ "email" : "root@stratpad.com", "password" : "StratP@d" }' -i https://rest.stratpad.com/logIn

// find user
reinhard.braun@pantec.com = 5945216137691136

// get a user
curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=QK7w91P4s8c5gX1Gl_xrIQ;Path=/;Expires=Thu, 21-Nov-13 01:04:17 GMT' -X GET -i https://rest.stratpad.com/users/5945216137691136
or
curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=VcK2zBvtaXNDsWEpTvyd9w;Path=/' -X GET -i https://rest.stratpad.com/users/email/durrani.khalid@gmail.com

// change password (note /changePassword requires knowledge of the old password, so use /users instead, which also means you need to provide values for all other fields or you lose them (except verified and verificationToken))
curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=VcK2zBvtaXNDsWEpTvyd9w;Path=/' -d '{ "password" : "changeme!", "passwordConfirmation": "changeme!", "email":"durrani.khalid@gmail.com","firstname":"Khalid","ipnOrderStatus":"PAYMENT_AUTHORIZED","ipnProductCode":"com.stratpad.cloud.unlimited","lastname":"Durrani","lcnStatus":"ACTIVE","preferredCurrency":"$", "subscriptionStartDate":1393372800000 }' -X PUT -i https://rest.stratpad.com/users/4792479396134912

// verify user - not actually required
curl -X POST -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=QK7w91P4s8c5gX1Gl_xrIQ;Path=/;Expires=Thu, 21-Nov-13 01:04:17 GMT' -i -d '{ "email" : "reinhard.braun@pantec.com", "verificationToken": "fake" }' "https://rest.stratpad.com/verifyUser

// try logging in as user
curl -X POST -H "Content-Type: application/json" -d '{ "email" : "reinhard.braun@pantec.com", "password" : "changeme!" }' -i https://rest.stratpad.com/logIn

// change user product code
curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=bUywlv4D4t9Ic4Nkh4pLCg;Path=/' -d '{ "firstname":"Alex","lastname":"Glassey", "ipnProductCode":"com.stratpad.cloud.unlimited","ipnOrderStatus":"COMPLETE" }' -X PUT -i https://jstratpad.appspot.com/users/5089381626937344


// delete user
curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=BVPDGO5JIaMhSl9Cszwekg;Path=/;Expires=Fri, 01-Nov-13 17:52:53 GMT' -X DELETE -i https://jstratpad.appspot.com/users/4906057390358528

// signup user
curl -X POST -H "Content-Type: application/json" -d '{ "email" : "julian@stratpad.com", "firstname" : "Julian", "lastname" : "Wood", "password" : "asdasd!", "passwordConfirmation" : "asdasd!" }' -i https://jstratpad.appspot.com/signUp


// get a stratfile as json
curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=QK7w91P4s8c5gX1Gl_xrIQ;Path=/;Expires=Thu, 21-Nov-13 01:04:17 GMT' -X GET -i https://rest.stratpad.com/stratfiles/5257491747176448

// as xml
curl -H "Content-Type: application/xml; charset=utf-8" -H "Accept: text/xml" --header 'Cookie: JSESSIONID=xvU3RMij0E09SLuWrhglVg;Path=/' -X GET -i https://rest.stratpad.com/stratfiles/6472025619038208?filename=test.xml

// resend verification
curl -X POST -H "Content-Type: application/json" -d '{ "email" : "julian@stratpad.com" }' -i https://jstratpad.appspot.com/sendEmailSignUp


// docx
curl -X POST -H 'Cookie: JSESSIONID=uPfVhGe8X2xh2jSYdJpQPw;Path=/' -d @docx.text -i https://jstratpad.appspot.com/summarybizplan


// pdf inline
curl -X POST -H 'Cookie: JSESSIONID=mjpCgeafCN1x7xI0GyHeIA;Path=/' -d @projectdetailfields.txt -i "https://jstratpad.appspot.com/pdfService" > temp.pdf

@projectdetailfields.txt
content=%3Chtml%3Ehello%3C%2Fhtml%3E&dateModified=123&filename=test.pdf&inline=true

// giving someone admin
easiest way is to use remoteapi, grab the user, then make a new UserRole with admin privs and save it


GAE CONSOLE
----------------------

Grabbing a user's stratfile using the admin console:

SELECT * FROM User where email = 'fsf@indubal.com';

Decoded entity key: UserRoot: name=USER_ROOT > User: id=4878726365970432

SELECT * FROM StratFile where user = KEY('UserRoot', 'USER_ROOT', 'User', 4878726365970432)

and then, using any of the stratfile ids:

curl -H "Content-Type: application/json" --header 'Cookie: JSESSIONID=3qlud6PeB4LZJdcx4GJN7w;Path=/' -X GET -i https://rest.stratpad.com/stratfiles/5082504578990080 > caltech.stratfile


or an Objective, for example:

Decoded entity key: StratFileRoot: name=STRATFILE_ROOT > StratFile: id=4530292043808768 > Theme: id=5304348229763072 > Objective: id=5339532601851904

// what we're looking for:
/stratfiles/6314434880339968/themes/6085736461762560/objectives/5698708368785408

SELECT * FROM Objective where __key__ = KEY('StratFileRoot', 'STRATFILE_ROOT', 'StratFile', 6314434880339968, 'Theme', 6085736461762560, 'Objective', 5698708368785408)


or a StratFile straight up:

Decoded entity key: StratFileRoot: name=STRATFILE_ROOT > StratFile: id=4530292043808768

SELECT * FROM StratFile where __key__ = KEY('StratFileRoot', 'STRATFILE_ROOT', 'StratFile', 4530292043808768)


or a User straight up:

Decoded entity key: UserRoot: name=USER_ROOT > User: id=4644642595274752

SELECT * FROM User where __key__ = KEY('UserRoot', 'USER_ROOT', 'User', 4644642595274752)


or a ServiceProvider (easier to approve this way, for now):

select * from ServiceProvider where __key__ = KEY('ServiceProviderRoot', 'SERVICE_PROVIDER_ROOT', 'ServiceProvider', 4815735301865472);

***new GQL query terminal:***

select * from ServiceProvider where __key__ = KEY(ServiceProviderRoot, "SERVICE_PROVIDER_ROOT", ServiceProvider, 5668515822436352)


or get ServiceProvider for a user

select * from ServiceProvider where user = KEY('UserRoot', 'USER_ROOT', 'User', 5643892774928384);


or BusinessLocation for a ServiceProvider

select * from BusinessLocation where ANCESTOR IS KEY('ServiceProviderRoot', 'SERVICE_PROVIDER_ROOT', 'ServiceProvider', 6169411283058688);



UTILITY SERVICES
-------------------

Admin users can delete the sample files, or even change them. Use these scripts to fix up the ACL's and reassociate them with users.

http://jstratpad.appspot.com/batch/cleanUserStratFilePermission
http://jstratpad.appspot.com/batch/initializeDefaultStratFiles

You need to be logged into the GAE console with sufficient permission.


--------------------

To get all stratfile ids, with their userid:
https://jstratpad.appspot.com/batch/exportEmailStratFileIds

User and stratfile info:
/users/[userId]/stratfiles
/users/[userId]/stratfiles/[stratfileid]
/users/email/[email]
/users

----------------------

RemoteAPI - for better querying and logic service

see com.glasseystrategy.jstratpad.tool.RemoteAPI in jstratpad


----------------------

Ad Words, ECommerce at Avangate

- choose stratpad.com
- choose Setup -> Ordering Options -> After Sale Message tab
- choose English -> Edit at the bottom
- Choose Tracking Script tab at the top (not the example)
	- we’re keeping our ecommerce here

- Setup -> Interface Templates
- Edit Button
- old: HEAD Information -> Meta & CSS
- HEAD Information -> Body Information -> Javascript Code
- near the bottom we have our tracking script
- this is included on all pages



-----------------------

StratFile Backups

- backups are run daily by a cron job on jstratpad-prod
- the raw files are stored in google cloud (see cron.xml in jstratpad)
- you can run a backup manually:
	- put the app in maintenance mode
		- sftp://stratpad:@stratpad.com//home/stratpad/public_html/cloud.stratpad.com/.htaccess
		- uncomment maintenance redirect
	- put the app in write only mode (Application Settings in the app engine console)
	- go to datastore admin, select all entities, and choose backup
	- use the batch queue
	- use Google Cloud Storage for destination
	- use jstratpad-backups/last or jstratpad-prod-backups/last as bucket
	- backup and wait a few minutes for the task queue to clear
- you can then import any backup
	- you probably want to clear the old db, though that may not be appropriate in all cases
	- then import on batch queue
	- once the queue has finished, re-enable writes (this one takes a while - in fact it appeared to still be going over 30 minutes later, but only 1 task at a time)

------------------------

SSL 

- we have a wildcard cert
- Site5 takes care of the installation
- no cpanel control at all
- the root .htaccess file controls SSL redirects for subdomains
- Digital Ocean is much better - just point apache config to the cert and key


-------------------------

Static html

- some html is on jstratpad
	- https://jstratpad.appspot.com/static/en.lproj/welcome.htm
- other html is in WordPress
	- see Help Pages navbar item
	- http://www.stratpad.com/wp-admin/
	- https://www.stratpad.com/help/write-your-plan/about-your-company/?iframe=1


--------------------------

XSS

- everytime we add a new field, or some new display of user-entered data, we need to be aware of xss
- the danger is that someone can enter <script>... and when we display it, it will execute
- what we want is to send the data to the server as is, server should return it as was, and when we display, we need to escape
- to escape, use triple-stash or {{{displayProp model 'attribute'}}} in a handlebars template, new Handlebars.SafeString() if you want to send a string to double-stash but prevent escaping, jquery text(), model.escape() for backbone accessors, _.escape() for anything else

--------------------------
SCSS (SASS)

http://sass-lang.com/documentation/file.SASS_REFERENCE.html

--------------------------
Tooltips

	Easiest to add in js, and then you can add some css to style the tip if needed. Place the text in the 'title' attribute.

    this.$el.find('h4.tooltip')
        .tooltipster({position:'bottom-left', touchDevices:false, delay:150, maxWidth: 665, offsetX: 20, theme: 'tooltipster-default tooltipster-share'});


---------------------------
REST PUT policy

- in general, you need to PUT all the properties you receive from a POST or a GET
- this means that you can't just PUT a couple of fields, since that will null out the other ones
- there are some exceptions to these rules; see code for more info


-------------------------------
Cache buster

- when publishing a new version of the site, we have new css and js; user has css and js cached on their local; we need them to get the new code
- see build.xml - optimize target for explanation

