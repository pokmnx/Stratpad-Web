We take advantage of Prince to convert our html files into pdf.

www.princexml.com

-- 

Install 64 bit .deb - has a couple of dependencies but easy enough with apt-get
Didn't need fontconfig.org this time around

Installed on pdf.stratpad.com, which is stratpad.com
- read notes in html2pdf.php

Deployed in /var/www/pdf.stratpad.com/public_html/pdf

URL: https://pdf.stratpad.com/pdf/html2pdf.php

curl -H "Content-Type: text/html" --header 'Authorization: token b4354c901f71614a2dc36687698cfc6c' -X POST -i -d @balancesheetexample.html "http://pdf.stratpad.com/pdf/html2pdf.php?uuid=488EF38B-88BC-4A88-BE39-48CCA5F57440&dateModified=1344408629" > bs.pdf