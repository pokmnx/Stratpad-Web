#!/usr/bin/env python


# just a little script to write out the reports from the qtests
# assumes python -m CGIHTTPServer running in stratweb/app
# leaves the result in stratweb/test/report.xml
# curl -X POST -i -d 'xml=hello' http://localhost:80/cgi-bin/stratwebtest/log.py

import cgi, os
form = cgi.FieldStorage()

# make sure you place a writable report.xml beside this cgi
f = open('report.xml', 'w')
f.write(form["xml"].value)
f.close()

# print is actually println
print "Access-Control-Allow-Origin: *";
print "Content-Type: text/html\n"

print "Success"


# currently we have an ant build.xml in stratweb/app
# place a cgi in localhost:80/cgi-bin/log.py to save the report.xml
# place a report.xml alongside log.py
# serve up localhost:8080/test/qtest.html
# this is what ant/phantomjs will hit for running tests
# when done, it will store the results at report.xml
# then ant will do an xml transform on report.xml and create some more xml, as well as html