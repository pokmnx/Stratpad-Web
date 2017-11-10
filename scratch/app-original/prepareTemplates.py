from xml.etree.ElementTree import ElementTree
import os, os.path

for dirRoot, dirs, files in os.walk('webapp/templates'):
	for f in files:
		fileName, fileExtension = os.path.splitext(f)
		if fileExtension == '.html':
			path = os.path.join(dirRoot, f)
			print ("Preparing handlbars template from: %s" % f)

			tree = ElementTree()
			tree.parse(path)

			root = tree.getroot()

			# todo: don't want to include the element that surrounds the element; note that there can be more than one child of the root
			# template without 
			if 'template' in root.attrib and root.attrib['template'] == 'handlebars':
				el = root
			else:
				el = root.findall(".//*[@template='handlebars']")

			newPath = os.path.join(dirRoot, ("%s.handlebars" % fileName))
			print ("Writing: %s" % newPath)

			if len(el):
				tree._setroot(el[0])

			tree.write(newPath)
