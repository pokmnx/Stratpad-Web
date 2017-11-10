# this is just a simple utility script which updated the structure of our static html files

from lxml import etree
import os, os.path

dirRoot = '../static/es-MX.lproj'
for f in os.listdir(dirRoot):
	fileName, fileExtension = os.path.splitext(f)
	if fileExtension == '.htm':
		path = os.path.join(dirRoot, f)
		print ("Rejigging: %s" % f)

		parser = etree.XMLParser(remove_blank_text=True)
		tree = etree.parse(path, parser)

		root = tree.getroot()
					
		namespace = "{http://www.w3.org/1999/xhtml}"
		body = root.find('{0}body'.format(namespace))

		h1 = body.find('{0}h1'.format(namespace))
		h2 = body.find('{0}h2'.format(namespace))
		
		body.remove(h1)
		body.remove(h2)
		

		# now we want to take the resultant body children and wrap them in article
		newBody = etree.Element('body')

		# add header
		header = etree.Element('header')
		hgroup = etree.SubElement(header, 'hgroup')
		hgroup.append(h1)
		hgroup.append(h2)
		newBody.append(header)

		# add article
		article = etree.SubElement(newBody, 'article', {'class': 'group'})
		for child in body.getchildren():
			article.append(child)

		root.remove(body)
		root.append(newBody)
				
		newPath = os.path.join(dirRoot, "new", ("%s.htm" % fileName))
		print ("Writing: %s" % newPath)

		tree.write(newPath, pretty_print=True)
		