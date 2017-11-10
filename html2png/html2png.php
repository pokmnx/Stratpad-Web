<?php

// for php, we will write the html to a temp file
// we need to take a width and a height
// multiply zoom (=3)
// phantomjs it to a png
// return the png
// delete files older than 1 day

// example invocation
// curl --header 'Authorization: token b4354c901f71614a2dc36687698cfc6c' -X POST -d @r9_goals_chart.html "http://localhost/phantom/html2png.php?width=1006&height=143" -k > my.png

// install phantomjs
// install this php script and raterize.js alongside each other in a web dir
// probably need to add an .htaccess as described below, for auth

// config

$phantom = '/home/ejrogers/phantomjs/bin/phantomjs';
$rasterize = '/home/ejrogers/web1.mobilesce.com/stratpad/html2png/rasterize.js';

// main

function emu_getallheaders() {
	foreach($_SERVER as $h=>$v)
		if(ereg('HTTP_(.+)',$h,$hp))
			$headers[$hp[1]]=$v;
	return $headers;
}

// check for auth
// - note that FastCGI will filter out the Authorization header
// - to fix it, need to add a rewrite rule to .htaccess
// - https://drupal.org/node/1365168

$token = 'token b4354c901f71614a2dc36687698cfc6c';
$headers = emu_getallheaders();
if ($headers['AUTHORIZATION'] != $token) {
	header("HTTP/1.1 403 Permission Denied");
	echo "Sorry, you need to provide correct authentication!\n\n";
	exit;
}

$zoom = 3;
$width = $_GET['width']*$zoom . 'px';
$height = $_GET['height']*$zoom . 'px';

// add in the html
$body = '';
$fh   = @fopen('php://input', 'r');
if ($fh)
{
  while (!feof($fh))
  {
    $s = fread($fh, 1024);
    if (is_string($s))
    {
      $body .= $s;
    }
  }
  fclose($fh);
}

// save content body to file
$in = tempnam('tmp', 'in');
$htmlfile = $in . '.html';
rename($in, $htmlfile);
file_put_contents($htmlfile, $body);

$pngfile = $in . '.png';

// $cmd = "whoami";
// $cmd = "$phantom --version";
$cmd = "$phantom $rasterize $htmlfile $pngfile \"$width*$height\" $zoom";
// $cmd = "cp $htmlfile $pngfile";
// $cmd = "/home/ejrogers/phantomjs/bin/phantomjs /home/ejrogers/web1.mobilesce.com/stratpad/html2png/rasterize.js /tmp/inuvoADL.html /tmp/inuvoADL.png \"3018px*429px\" 3 2>&1";
exec($cmd, $output, $return);
unlink($htmlfile);

// unlink even if cancelled for some reason
ignore_user_abort(true);

// open the file in a binary mode
$fp = fopen($pngfile, 'rb');

// send the right headers
header("Content-Type: image/png");
header("Content-Length: " . filesize($pngfile));

// dump the picture and cleanup
fpassthru($fp);
unlink($pngfile);
exit;
?>
