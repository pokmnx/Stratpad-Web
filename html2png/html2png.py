#!/usr/bin/python

# curl --header 'Authorization: token b4354c901f71614a2dc36687698cfc6c' -X POST -d @r9_goals_chart.html "http://phantom.stratpad.com/cgi-bin/html2png.py" > chart.png
# curl --header 'Authorization: token b4354c901f71614a2dc36687698cfc6c' -X POST -d @test2.html "http://phantom.stratpad.com/cgi-bin/html2png.py" > test.png
# note that we we will zoom by 3 and give you a chart 3x as big, in order to get good resolution
# have to raise privs on phantomjs (sudoers)
# we're just using lighttpd with CGI and python

import subprocess
import sys, os, cgi, tempfile
import cgitb; cgitb.enable()

#config 
phantomjs = "/usr/bin/phantomjs"
rasterize = os.path.dirname(os.path.abspath(__file__)) + "/rasterize.js"

# check auth
auth = os.environ["HTTP_AUTHORIZATION"]
token = 'token b4354c901f71614a2dc36687698cfc6c'
if auth != token:
	sys.stdout.write( 'Status: 403 Forbidden\r\n\r\n' )
	sys.stdout.write( "Sorry, you need to provide correct authentication!\n" )
	sys.exit(0)

# write html to temp file from body of POST
fd, htmlfilepath = tempfile.mkstemp('.html'); os.close(fd)
dumped = open(htmlfilepath, 'wb')
for line in sys.stdin.readline():
    dumped.write(line)
dumped.close()
    
# # get query args
# args = cgi.FieldStorage()
# zoom = str(args['zoom'].value)
# width = str(args['width'].value) + 'px'
# height = str(args['height'].value) + 'px'
# dims = width + "*" + height

# phantom
fd, pngfilepath = tempfile.mkstemp('.png'); os.close(fd)
args = ["sudo", phantomjs, "--ignore-ssl-errors=true", "--ssl-protocol=any", rasterize, htmlfilepath, pngfilepath]
result = subprocess.call(args)

# response
sys.stdout.write( "Content-type: image/png\r\n" )
sys.stdout.write( "Content-Length: " + str(os.path.getsize(pngfilepath)) + "\r\n" )
sys.stdout.write( "\r\n" )
sys.stdout.write( file(pngfilepath,"rb").read() )
