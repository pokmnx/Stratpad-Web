<?php 

// we're taking a single piece of html (mostly rendered by js), as input
//   maybe we can split off the css? - yes
//   it can be the content body of the post
// we also need an API id (Authorization token header)
// we're using SSL - a self-signed cert
// the html is then run through prince
// we return a pdf as an attachment

// curl -H "Content-Type: text/html" --header 'Authorization: token b4354c901f71614a2dc36687698cfc6c' -X POST -i -d @balancesheetexample.html "http://pdf.stratpad.com/pdf/html2pdf.php?uuid=488EF38B-88BC-4A88-BE39-48CCA5F57440&dateModified=1344408629" > bs.pdf

// add this line to cron to cleanup
// 0 0 * * * find /var/www/pdf.stratpad.com/public_html/pdf/tmp -mtime +7 -exec rm {} \;

// need to install Helvetica truetype fonts on the system
// can also remap sans-serif if desired in /usr/lib/prince/style/fonts.css, but not necessary

$prince = '/usr/bin/prince';

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

// we need to update the style sheet (for ipad - not used with stratweb)
$body = str_replace("financials.css", "../financials-prince.css", $body);

// save content body to file
$in = tempnam('tmp', 'in');
$htmlfile = $in . '.html';
rename($in, $htmlfile);
file_put_contents($htmlfile, $body);

// run it through prince
// note that we have remote css in the $htmlfile, which prince needs to fetch
// eg. curl https://staging.stratpad.com/css/prince.css --user-agent "Mozilla"
// prince doesn't seem to need the user-agent, but curl does
// also, prince can have this problem lately (and thus we get no css): 
//   $ bin/prince http://www.google.com -o google.pdf
//   $ prince: http://www.google.com: error: Couldn't resolve host 'www.google.com'
$pdffile = 'tmp/' . basename($in) . '.pdf';
$output = `$prince --ssl-blindly-trust-server --javascript $htmlfile -o $pdffile 2>&1`; //or use &>>prince.log


// return file as attachment
if (file_exists($pdffile)) {
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename='.basename('financialreport.pdf'));
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Content-Length: ' . filesize($pdffile));
    ob_clean();
    flush();
    readfile($pdffile);
}

?>
